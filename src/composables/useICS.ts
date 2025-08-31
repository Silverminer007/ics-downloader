import type {CalendarEvent} from "../types";

export function useICS() {
    function formatDateTime(dateStr: string) {
        const date = new Date(dateStr)
        return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z' // YYYYMMDDTHHMMSSZ
    }

    function generateICS(events: CalendarEvent[]) {
        const header = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//MyCalendarApp//EN',
        ].join('\r\n')

        const footer = 'END:VCALENDAR'

        const body = events
            .map(e => {
                const lines = [
                    'BEGIN:VEVENT',
                    `SUMMARY:${e.title}`,
                    `DTSTART:${formatDateTime(e.start)}`,
                ]
                if (e.end) lines.push(`DTEND:${formatDateTime(e.end)}`)
                if (e.location) lines.push(`LOCATION:${e.location}`)
                if (e.description) lines.push(`DESCRIPTION:${e.description}`)
                lines.push('END:VEVENT')
                return lines.join('\r\n')
            })
            .join('\r\n')

        return [header, body, footer].join('\r\n')
    }

    function downloadICS(events: CalendarEvent[], filename = 'calendar.ics') {
        const icsContent = generateICS(events)
        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = filename
        link.click()
        URL.revokeObjectURL(link.href)
    }

    return {
        generateICS,
        downloadICS,
    }
}