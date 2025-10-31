import { computed, ref, watch, type Ref } from 'vue'
import type { SeatCoordinate } from '@/entities/session'

function seatKey(seat: SeatCoordinate) {
  return `${seat.rowNumber}-${seat.seatNumber}`
}

export interface UseSeatSelectionOptions {
  bookedSeats: Ref<SeatCoordinate[]>
  initialSelection?: SeatCoordinate[]
}

export function useSeatSelection(options: UseSeatSelectionOptions) {
  const selectedSeats = ref<SeatCoordinate[]>(options.initialSelection ?? [])

  const bookedSet = computed(() => new Set(options.bookedSeats.value.map(seatKey)))

  function setSelection(seats: SeatCoordinate[]) {
    selectedSeats.value = seats.filter((seat) => !bookedSet.value.has(seatKey(seat)))
  }

  function toggleSeat(seat: SeatCoordinate) {
    if (bookedSet.value.has(seatKey(seat))) {
      return
    }

    const key = seatKey(seat)
    const exists = selectedSeats.value.some((item) => seatKey(item) === key)

    if (exists) {
      selectedSeats.value = selectedSeats.value.filter((item) => seatKey(item) !== key)
    } else {
      selectedSeats.value = [...selectedSeats.value, seat]
    }
  }

  function reset() {
    selectedSeats.value = []
  }

  watch(
    options.bookedSeats,
    (newBooked) => {
      const newBookedSet = new Set(newBooked.map(seatKey))
      selectedSeats.value = selectedSeats.value.filter((seat) => !newBookedSet.has(seatKey(seat)))
    }
  )

  return {
    selectedSeats,
    toggleSeat,
    reset,
    setSelection,
  }
}
