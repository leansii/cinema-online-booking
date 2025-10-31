import { describe, expect, it } from 'vitest'
import { groupSessionsByDate } from '../session.helpers'
import type { SessionDto } from '../session.types'

const sessions: SessionDto[] = [
  { id: 1, movieId: 1, cinemaId: 10, startTime: '2025-03-20T12:00:00.000Z' },
  { id: 2, movieId: 2, cinemaId: 20, startTime: '2025-03-20T15:00:00.000Z' },
  { id: 3, movieId: 1, cinemaId: 10, startTime: '2025-03-21T18:30:00.000Z' },
]

describe('groupSessionsByDate', () => {
  it('groups sessions by date and lookup entity', () => {
    const groups = groupSessionsByDate(sessions, (session) => session.cinemaId, {
      entityLookup: {
        10: 'Cinema One',
        20: 'Cinema Two',
      },
      fallbackName: 'Unknown',
    })

    expect(groups).toHaveLength(2)

    const firstGroup = groups[0]
    expect(firstGroup?.dateLabel).toBe('20.03')
    expect(firstGroup?.items.length).toBe(2)
    expect(firstGroup?.items[0]?.entityName).toBe('Cinema One')
    expect(firstGroup?.items[0]?.slots.length).toBe(1)

    const secondGroupFirstSlot = groups[1]?.items[0]?.slots[0]
    expect(secondGroupFirstSlot?.timeLabel).toBeDefined()
  })
})
