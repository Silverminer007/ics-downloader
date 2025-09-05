export interface CalendarEvent {
    title: string
    start: string // ISO String, z.B. '2025-09-01T09:00'
    end?: string  // optional, z.B. '2025-09-01T10:00'
    location?: string // optional
    description?: string // optional
    color?: string
}

export interface Calendar {
    name: string
    color: string
    events: CalendarEvent[]
}