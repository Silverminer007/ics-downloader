import type {Calendar} from "../types";

export function useICS() {

    function formatDateTime(dateStr: string, allDay = false) {
        const date = new Date(dateStr);

        if (allDay) {
            // YYYYMMDD (ganztägig, ohne Uhrzeit)
            return date.toISOString().split("T")[0].replace(/-/g, "");
        }

        // Lokale Zeit in Europe/Berlin, ohne Z (also kein UTC!)
        const pad = (n: number) => String(n).padStart(2, "0");
        const year = date.getFullYear();
        const month = pad(date.getMonth() + 1);
        const day = pad(date.getDate());
        const hours = pad(date.getHours());
        const minutes = pad(date.getMinutes());
        const seconds = pad(date.getSeconds());

        return `${year}${month}${day}T${hours}${minutes}${seconds}`;
    }

    function escapeText(text: string) {
        return text
            .replace(/\\/g, "\\\\")
            .replace(/;/g, "\\;")
            .replace(/,/g, "\\,")
            .replace(/\r?\n/g, "\\n");
    }

    function foldLine(line: string) {
        if (line.length <= 75) return line;
        let result = "";
        while (line.length > 75) {
            result += line.slice(0, 75) + "\r\n ";
            line = line.slice(75);
        }
        return result + line;
    }

    function generateICS(calendars: Calendar[]) {
        const header = [
            "BEGIN:VCALENDAR",
            "VERSION:2.0",
            "PRODID:-//MyCalendarApp//EN",
            "CALSCALE:GREGORIAN",
            "METHOD:PUBLISH",
            "X-WR-TIMEZONE:Europe/Berlin",
        ].join("\r\n");

        const footer = "END:VCALENDAR";

        const body = calendars.map(cal =>
            cal.events
                .map((e, i) => {
                    const uid = `${i}-${Date.now()}@calendar.kjg-st-barbara.de`;
                    const dtstamp = formatDateTime(new Date().toISOString());

                    const allDay =
                        !e.start.includes("T") || (e.end && !e.end.includes("T"));

                    const lines = [
                        "BEGIN:VEVENT",
                        `UID:${uid}`,
                        `DTSTAMP:${dtstamp}Z`, // DTSTAMP bleibt in UTC
                        `SUMMARY:${escapeText(e.title)}`,
                        allDay
                            ? `DTSTART;VALUE=DATE:${formatDateTime(e.start, true)}`
                            : `DTSTART;TZID=Europe/Berlin:${formatDateTime(e.start)}`,
                    ];

                    if (e.end) {
                        lines.push(
                            allDay
                                ? `DTEND;VALUE=DATE:${formatDateTime(e.end, true)}`
                                : `DTEND;TZID=Europe/Berlin:${formatDateTime(e.end)}`
                        );
                    }
                    if (e.location)
                        lines.push(`LOCATION:${escapeText(e.location)}`);
                    if (e.description)
                        lines.push(`DESCRIPTION:${escapeText(e.description)}`);

                    lines.push("END:VEVENT");

                    return lines.map(foldLine).join("\r\n");
                })
                .join("\r\n"))
            .join("\r\n");

        return [header, body, footer].join("\r\n");
    }

    return {
        generateICS,
    };
}