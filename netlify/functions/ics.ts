import {readFileSync} from "fs";
import path from "path";
import {useICS} from "../../src/composables/useICS";

export async function handler(event) {
    try {
        // JSON aus /data laden (liegt im Projekt-Root)
        const dataPath = path.resolve("src/data/events.json");
        const calendars = JSON.parse(readFileSync(dataPath, "utf-8"));

        // Query-Parameter
        const selected = event.queryStringParameters?.cal?.split(",") || [];

        const events = useICS().generateICS(calendars.filter(cal => {
            console.log(cal.name);
            console.log(selected.includes(cal.name));
            return selected.includes(cal.name);
        }));

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "text/calendar; charset=utf-8",
                "Content-Disposition": "attachment; filename=calendar.ics",
            },
            body: events,
        };
    } catch (err: any) {
        console.error("ICS Function Error:", err);
        return {statusCode: 500, body: JSON.stringify({error: err.message})};
    }
}
