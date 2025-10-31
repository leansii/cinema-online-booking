import { describe, expect, it, vi } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { useBookings } from '../useBookings'
import * as api from '../../api/booking.api'
import * as sessionApi from '@/entities/session'

vi.mock('@/shared/config/env', () => ({
  getApiBaseUrl: () => 'http://localhost',
}))

vi.mock('../../api/booking.api', () => ({
  fetchBookings: vi.fn(),
  fetchSettings: vi.fn(),
  payBooking: vi.fn(),
}))

vi.mock('@/entities/session', async () => {
  const actual = await vi.importActual<typeof import('@/entities/session')>(
    '@/entities/session'
  )

  return {
    ...actual,
    fetchSessionDetails: vi.fn(),
  }
})

describe('useBookings', () => {
  it('groups bookings correctly', async () => {
    vi.mocked(api.fetchBookings).mockResolvedValue([
      {
        id: '1',
        userId: 1,
        movieSessionId: 10,
        sessionId: 10,
        bookedAt: '2025-03-20T10:00:00.000Z',
        seats: [{ rowNumber: 1, seatNumber: 1 }],
        isPaid: false,
      },
      {
        id: '2',
        userId: 1,
        movieSessionId: 11,
        sessionId: 11,
        bookedAt: '2025-03-15T10:00:00.000Z',
        seats: [{ rowNumber: 1, seatNumber: 2 }],
        isPaid: true,
      },
    ])

    vi.mocked(api.fetchSettings).mockResolvedValue({ bookingPaymentTimeSeconds: 600 })

    vi.setSystemTime(new Date('2025-03-19T10:00:00.000Z'))

    vi.mocked(sessionApi.fetchSessionDetails).mockImplementation(async (id: number) => ({
      id,
      movieId: id === 10 ? 100 : 101,
      cinemaId: id === 10 ? 200 : 201,
      startTime: id === 10 ? '2025-03-21T10:00:00.000Z' : '2025-03-22T10:00:00.000Z',
      seats: { rows: 5, seatsPerRow: 5 },
      bookedSeats: [],
    }))

    const bookings = useBookings(() => ({
      movies: [
        { id: 100, title: 'Movie A', description: '', rating: 0, year: 2024, lengthMinutes: 120, posterImage: null },
        { id: 101, title: 'Movie B', description: '', rating: 0, year: 2024, lengthMinutes: 120, posterImage: null },
      ],
      cinemas: [
        { id: 200, name: 'Cinema A', address: 'Address A' },
        { id: 201, name: 'Cinema B', address: 'Address B' },
      ],
      sessions: {
        10: {
          id: 10,
          movieId: 100,
          cinemaId: 200,
          startTime: '2025-03-21T10:00:00.000Z',
        },
      },
    }))

    await bookings.loadAll()
    await flushPromises()

    expect(bookings.grouped.value.unpaid).toHaveLength(1)
    expect(bookings.grouped.value.upcoming).toHaveLength(1)
    expect(bookings.grouped.value.past).toHaveLength(0)

    vi.useRealTimers()
  })
})
