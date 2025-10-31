<script setup lang="ts">
import { computed, unref } from 'vue'
import type { Ref } from 'vue'
import SeatCell from './SeatCell.vue'
import type { SeatCoordinate } from '@/entities/session'

const props = withDefaults(
  defineProps<{
    rows: number
    seatsPerRow: number
    bookedSeats: SeatCoordinate[] | Ref<SeatCoordinate[]>
    selectedSeats: SeatCoordinate[] | Ref<SeatCoordinate[]>
    interactive?: boolean
  }>(),
  {
    interactive: true,
  }
)

const emit = defineEmits<{
  (event: 'toggle', seat: SeatCoordinate): void
}>()

function seatKey(seat: SeatCoordinate) {
  return `${seat.rowNumber}-${seat.seatNumber}`
}

const bookedSet = computed(() => new Set(unref(props.bookedSeats).map(seatKey)))
const selectedSet = computed(() => new Set(unref(props.selectedSeats).map(seatKey)))

function handleSelect(rowNumber: number, seatNumber: number) {
  if (!props.interactive) {
    return
  }

  const seat: SeatCoordinate = { rowNumber, seatNumber }

  if (bookedSet.value.has(seatKey(seat))) {
    return
  }

  emit('toggle', seat)
}
</script>

<template>
  <div class="seat-map">
    <div class="seat-map__header" :style="{ gridTemplateColumns: `repeat(${seatsPerRow}, 32px)` }">
      <span v-for="seatNumber in seatsPerRow" :key="seatNumber">{{ seatNumber }}</span>
    </div>
    <div class="seat-map__rows">
      <div v-for="rowNumber in rows" :key="rowNumber" class="seat-map__row">
        <span class="seat-map__row-label">ряд {{ rowNumber }}</span>
        <div
          class="seat-map__row-seats"
          :style="{ gridTemplateColumns: `repeat(${seatsPerRow}, 32px)` }"
        >
          <SeatCell
            v-for="seatNumber in seatsPerRow"
            :key="seatNumber"
            :label="`Ряд ${rowNumber}, место ${seatNumber}`"
            :status="
              bookedSet.has(`${rowNumber}-${seatNumber}`)
                ? 'booked'
                : selectedSet.has(`${rowNumber}-${seatNumber}`)
                  ? 'selected'
                  : 'available'
            "
            @select="handleSelect(rowNumber, seatNumber)"
          />
        </div>
      </div>
    </div>
    <div class="seat-map__legend">
      <div class="seat-map__legend-item">
        <span class="seat-map__legend-dot seat-map__legend-dot--available" /> Свободно
      </div>
      <div class="seat-map__legend-item">
        <span class="seat-map__legend-dot seat-map__legend-dot--selected" /> Выбрано
      </div>
      <div class="seat-map__legend-item">
        <span class="seat-map__legend-dot seat-map__legend-dot--booked" /> Занято
      </div>
    </div>
  </div>
</template>

<style scoped>
.seat-map {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.seat-map__header {
  display: grid;
  grid-template-columns: repeat(var(--seats-per-row), 32px);
  gap: 8px;
  justify-content: center;
  color: var(--color-text-secondary);
  font-size: 12px;
}

.seat-map__rows {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.seat-map__row {
  display: flex;
  align-items: center;
  gap: 16px;
  justify-content: center;
}

.seat-map__row-label {
  width: 70px;
  text-transform: lowercase;
  color: var(--color-text-secondary);
  font-size: 14px;
}

.seat-map__row-seats {
  display: grid;
  grid-template-columns: repeat(var(--seats-per-row), 32px);
  gap: 8px;
}

.seat-map__legend {
  display: flex;
  gap: 24px;
  justify-content: center;
  color: var(--color-text-secondary);
  font-size: 14px;
}

.seat-map__legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.seat-map__legend-dot {
  width: 16px;
  height: 16px;
  border-radius: 4px;
  border: 1px solid var(--color-border);
}

.seat-map__legend-dot--available {
  background-color: transparent;
}

.seat-map__legend-dot--selected {
  background-color: rgba(255, 255, 255, 0.75);
  border-color: rgba(255, 255, 255, 0.9);
}

.seat-map__legend-dot--booked {
  background-color: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.15);
}
</style>
