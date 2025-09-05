<script setup lang="ts">
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction'
import deLocale from '@fullcalendar/core/locales/de'
import {computed, reactive, ref} from "vue";

import calendarsData from './data/events.json'
import type {CalendarEvent} from "./types";
import DownloadCalendars from "./components/DownloadCalendars.vue";
import Dialog from "primevue/dialog";
import DateDetailDialog from "./components/DateDetailDialog.vue";

// Alle Events aus allen Kalendern zusammenführen
const events = computed<CalendarEvent[]>(() => {
  return calendarsData.flatMap(calendar =>
      calendar.events.map(e => ({...e, color: calendar.color}))
  )
})

const calendarRef = ref(null)
const calendarTitle = ref('')
const selectedEvent = ref<CalendarEvent | undefined>(undefined)
const showDateDetails = ref(false);
const downloadDialog = ref(false);

const listView = reactive({
  plugins: [interactionPlugin, listPlugin],
  initialView: 'listMonth',
  events: events,
  locale: deLocale,
  firstDay: 1,
  height: "100%",
  headerToolbar: {
    center: 'prev,next today downloadAsIcs',
    right: '',
    left: ''
  },
  customButtons: {
    downloadAsIcs: {
      text: 'Termine herunterladen',
      click: () => downloadDialog.value = true
    }
  },
  datesSet: (info: any) => {
    const date = info.start
    calendarTitle.value = date.toLocaleString('default', {month: 'long', year: 'numeric'})
  },
  eventClick: (info: any) => {
    // Kalender-Event übernehmen
    selectedEvent.value = {
      title: info.event.title,
      start: info.event.startStr,
      end: info.event.endStr,
      location: info.event.extendedProps.location,
      description: info.event.extendedProps.description,
    }
    showDateDetails.value = true
  },
})

const monthView = reactive({
  plugins: [dayGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  events: events,
  locale: deLocale,
  firstDay: 1,
  height: "100%",
  headerToolbar: {
    right: 'prev,next today downloadAsIcs',
    center: 'title',
    left: ''
  },
  customButtons: {
    downloadAsIcs: {
      text: 'Termine herunterladen',
      click: () => downloadDialog.value = true
    }
  },
  eventClick: (info: any) => {
    // Kalender-Event übernehmen
    selectedEvent.value = {
      title: info.event.title,
      start: info.event.startStr,
      end: info.event.endStr,
      location: info.event.extendedProps.location,
      description: info.event.extendedProps.description,
    }
    showDateDetails.value = true
  },
})
</script>

<template>
  <div class="h-screen flex flex-col">
    <Dialog v-model:visible="downloadDialog">
      <DownloadCalendars/>
    </Dialog>
    <DateDetailDialog v-model="showDateDetails" :event="selectedEvent"/>
    <div class="hidden sm:block m-2 flex-grow">
      <FullCalendar ref="calendarRef" :options="monthView"/>
    </div>
    <div class="block sm:hidden calendar-wrapper flex-grow">
      <h2 class="calendar-title text-2xl m-2">{{ calendarTitle }}</h2>
      <FullCalendar ref="calendarRef" :options="listView"/>
    </div>
  </div>
</template>