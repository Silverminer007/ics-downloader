<script setup lang="ts">
import {computed, ref, watch} from 'vue'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import Checkbox from 'primevue/checkbox'

// JSON importieren
import calendarsData from './../data/events.json'
import {useICS} from "../composables/useICS.ts";

const props = defineProps<{
  dialogVisible: boolean
}>();
const emit = defineEmits<{
  (e: 'update:dialogVisible', visible: boolean): void
}>();
const visible = ref(props.dialogVisible)
watch(visible, (val) => {
  emit('update:dialogVisible', val)
})
watch(() => props.dialogVisible, (val) => {
  visible.value = val
})

const {downloadICS} = useICS();

// Trackt, welche Kalender ausgewählt sind
const selectedCalendars = ref<string[]>([])

// Helper: alle Events aus ausgewählten Kalendern
const selectedEvents = computed(() => {
  return calendarsData
      .filter(c => selectedCalendars.value.includes(c.name))
      .flatMap(c => c.events.map(e => ({...e, color: c.color})))
})

function exportSelectedCalendars() {
  downloadICS(selectedEvents.value)
}

// Hilfsfunktion: alle Checkboxen auswählen
function selectAllCalendars() {
  selectedCalendars.value = calendarsData.map(c => c.name)
}
</script>


<template>
  <Dialog header="Termine in eigenen Kalender übernehmen" v-model:visible="visible" modal :closable="true">
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
              @click="exportSelectedCalendars"/>
    </div>
  </Dialog>
</template>