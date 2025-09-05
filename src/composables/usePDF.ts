// useCalendarPDF.ts
import {ref} from "vue";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type {CalendarEvent} from "../types";

export function useCalendarPDF() {
    const isGenerating = ref(false);

    function formatDateTime(dateStr: string, includeDate: boolean = true) {
        const date = new Date(dateStr);
        return date.toLocaleString([], {
            dateStyle: includeDate ? "short" : undefined,
            timeStyle: "short",
        });
    }

    function generateDoc(events: CalendarEvent[]) {
        const doc = new jsPDF("p", "mm", "a4");
        doc.setFontSize(16);

        const tableData: string[][] = [];

        events.forEach(e => {
            const startDate = new Date(e.start);
            const endDate = e.end ? new Date(e.end) : undefined;

            // Endzeit formatieren
            let endStr = "";
            if (endDate && e.end) {
                const includeDate = startDate.toDateString() !== endDate.toDateString();
                endStr = formatDateTime(e.end, includeDate);
            }

            // Zeile 1: Start – Ende | Titel
            tableData.push([`${formatDateTime(e.start)} – ${endStr}`, e.title]);
            // Zeile 2: Ort | Beschreibung
            if (e.location || e.description) {
                tableData.push([e.location || "", e.description || ""]);
            }
            // Leerzeile zwischen Terminen
            tableData.push(["", ""]);
        });

        // Spalten: zwei Spalten für neue Zeilenstruktur
        const columns = ["Datum/Zeit", "Titel / Info"];

        autoTable(doc, {
            head: [columns],
            body: tableData,
            startY: 10,
            theme: "plain", // keine Linien
            styles: {
                fontSize: 12,
                cellPadding: 2,
                textColor: 20,
            },
            headStyles: {fillColor: [41, 128, 185], textColor: 255, fontStyle: "bold"},
        });

        return doc;
    }

    function downloadPDF(events: CalendarEvent[]) {
        isGenerating.value = true;
        try {
            const doc = generateDoc(events);
            doc.save("kalender.pdf");
        } finally {
            isGenerating.value = false;
        }
    }

    return {downloadPDF, isGenerating};
}