<script setup lang="ts">
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction'
import deLocale from '@fullcalendar/core/locales/de'
import {computed, reactive, ref} from "vue";
import DownloadDialog from './components/DownloadDialog.vue'

import calendarsData from './data/events.json'
import type {CalendarEvent} from "./types";

// Alle Events aus allen Kalendern zusammenführen
const events = computed<CalendarEvent[]>(() => {
  return calendarsData.flatMap(calendar =>
      calendar.events.map(e => ({...e, color: calendar.color}))
  )
})

const calendarRef = ref(null)
const calendarTitle = ref('')

const listView = reactive({
  plugins: [interactionPlugin, listPlugin],
  initialView: 'listWeek',
  events: events,
  locale: deLocale,
  firstDay: 1,
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
  datesSet: (info : any) => {
    const date = info.start
    calendarTitle.value = date.toLocaleString('default', { month: 'long', year: 'numeric' })
  }
})

const downloadDialog = ref(false);

const monthView = reactive({
  plugins: [dayGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  events: events,
  locale: deLocale,
  firstDay: 1,
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
  }
})
</script>

<template>
  <DownloadDialog v-model:dialogVisible="downloadDialog" />
  <div class="hidden sm:block">
    <FullCalendar ref="calendarRef" :options="monthView"/>
  </div>
  <div class="block sm:hidden calendar-wrapper">
    <h2 class="calendar-title text-2xl m-2">{{ calendarTitle }}</h2>
    <FullCalendar ref="calendarRef" :options="listView"/>
  </div>
</template>