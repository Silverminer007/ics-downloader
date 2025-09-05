<script setup lang="ts">
import Dialog from "primevue/dialog"
import Button from "primevue/button"
import type {CalendarEvent} from "../types";
import {useICS} from "../composables/useICS.ts";

const props = defineProps<{
  modelValue: boolean
  event?: CalendarEvent
}>()

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void
}>()

// Hilfsfunktion: Start/Endzeit schön formatieren
function formatDate(dateStr?: string) {
  if (!dateStr) return ""
  const date = new Date(dateStr)
  return date.toLocaleString("de-DE", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

const {generateEventICS} = useICS();

function downloadICS() {
  if (!props.event) {
    return
  }
  const icsContent = generateEventICS([props.event]);
  const blob = new Blob([icsContent], {
    type: "text/calendar;charset=utf-8",
  });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = props.event?.title + ".ics";
  link.click();
  URL.revokeObjectURL(link.href);
}
</script>

<template>
  <Dialog
      v-model:visible="props.modelValue"
      modal
      :header="props.event?.title || ''"
      class="w-11/12 md:w-2/3 lg:w-1/2"
      @update:visible="emit('update:modelValue', $event)"
  >
    <div v-if="props.event" class="space-y-4">
      <div>
        <p><strong>Beginn:</strong> {{ formatDate(props.event.start) }}</p>
        <p><strong>Ende:</strong> {{ formatDate(props.event.end) }}</p>
      </div>

      <div v-if="props.event.location">
        <p><strong>Ort:</strong> {{ props.event.location }}</p>
      </div>

      <div v-if="props.event.description">
        <p><strong>Beschreibung:</strong></p>
        <p>{{ props.event.description }}</p>
      </div>
    </div>

    <template #footer>
      <Button label="Termin herunterladen" :disabled="!props.event" icon="pi pi-download" @click="downloadICS"/>
      <Button label="Schließen" icon="pi pi-times" @click="emit('update:modelValue', false)"/>
    </template>
  </Dialog>
</template>