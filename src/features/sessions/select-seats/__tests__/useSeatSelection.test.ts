import { describe, expect, it } from 'vitest'
import { nextTick, ref } from 'vue'
import { useSeatSelection } from '../useSeatSelection'

describe('useSeatSelection', () => {
  it('toggles seats and ignores booked ones', () => {
    const booked = ref([{ rowNumber: 1, seatNumber: 1 }])
    const { selectedSeats, toggleSeat } = useSeatSelection({ bookedSeats: booked })

    toggleSeat({ rowNumber: 1, seatNumber: 1 })
    expect(selectedSeats.value).toHaveLength(0)

    toggleSeat({ rowNumber: 1, seatNumber: 2 })
    expect(selectedSeats.value).toHaveLength(1)

    toggleSeat({ rowNumber: 1, seatNumber: 2 })
    expect(selectedSeats.value).toHaveLength(0)
  })

  it('drops seats when they become booked', async () => {
    const booked = ref([{ rowNumber: 1, seatNumber: 1 }])
    const { selectedSeats, toggleSeat } = useSeatSelection({ bookedSeats: booked })

    toggleSeat({ rowNumber: 1, seatNumber: 3 })
    expect(selectedSeats.value).toHaveLength(1)

    booked.value = [...booked.value, { rowNumber: 1, seatNumber: 3 }]
    await nextTick()
    expect(selectedSeats.value).toHaveLength(0)
  })
})
