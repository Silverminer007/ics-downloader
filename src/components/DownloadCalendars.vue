<script setup lang="ts">
import Button from 'primevue/button'
import Checkbox from 'primevue/checkbox'
import ProgressSpinner from 'primevue/progressspinner'

// JSON importieren
import calendarsData from './../data/events.json'
import {computed, ref} from "vue";
import {useCalendarPDF} from "../composables/usePDF.ts";

const {isGenerating, downloadPDF} = useCalendarPDF();

// Trackt, welche Kalender ausgewählt sind
const selectedCalendars = ref<string[]>([])

const selectedEvents = computed(() => {
  return calendarsData
      .filter(c => selectedCalendars.value.includes(c.name))
      .flatMap(c => c.events.map(e => ({...e, color: c.color})))
})

function exportSelectedCalendars() {
  const link = document.createElement("a");
  link.href = "/.netlify/functions/ics?cal=" + selectedCalendars.value.map(c => encodeURIComponent(c)).join(",");
  link.download = "calendar.ics";
  link.click();
}

// Hilfsfunktion: alle Checkboxen auswählen
function selectAllCalendars() {
  selectedCalendars.value = calendarsData.map(c => c.name)
}
</script>

<template>
  <div class="flex flex-col gap-3 mb-3">
    <Button severity="secondary" label="Alle auswählen" icon="pi pi-check" @click="selectAllCalendars"/>
    <div v-for="calendar in calendarsData" :key="calendar.name"
         class="flex flex-row gap-2">
      <Checkbox
          :inputId="calendar.name"
          v-model="selectedCalendars"
          :value="calendar.name"
      />
      <label :for="calendar.name">{{ calendar.name }}</label>
    </div>
  </div>

  <h2 class="text-xl font-bold">Ausgewählt Kalender ...</h2>
  <ProgressSpinner style="width: 40px; height: 40px" stroke-width="6" v-if="isGenerating"/>
  <div class="flex flex-row gap-2 items-center justify-center">
    <Button label="in Kalender übernehmen" icon="pi pi-calendar" class="p-button-success"
            :disabled="selectedCalendars.length === 0"
            @click="exportSelectedCalendars"/>
    <Button label="als PDF herunterladen" icon="pi pi-download" class="p-button-success"
            :disabled="selectedCalendars.length === 0"
            @click="downloadPDF(selectedEvents)"/>
  </div>
</template>

<style scoped>

</style>