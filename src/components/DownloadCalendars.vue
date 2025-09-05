<script setup lang="ts">
import Button from 'primevue/button'
import Checkbox from 'primevue/checkbox'

// JSON importieren
import calendarsData from './../data/events.json'
import {ref} from "vue";

// Trackt, welche Kalender ausgewählt sind
const selectedCalendars = ref<string[]>([])

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

  <div class="flex flex-row gap-2 items-center justify-center">
    <Button severity="secondary" label="Alle auswählen" icon="pi pi-check" @click="selectAllCalendars"/>

    <Button label="Ausgewählte Termine herunterladen" icon="pi pi-download" class="p-button-success"
            :disabled="selectedCalendars.length === 0"
            @click="exportSelectedCalendars"/>
  </div>
</template>

<style scoped>

</style>