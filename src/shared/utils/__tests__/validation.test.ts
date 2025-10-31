import { describe, it, expect } from 'vitest'
import {
  validatePassword,
  validatePasswordConfirmation,
  validateSeatSelection,
  validateUsername,
} from '../validation'

describe('validation utils', () => {
  it('validates username length', () => {
    expect(validateUsername('user').valid).toBe(false)
    expect(validateUsername('username').valid).toBe(true)
  })

  it('validates password complexity', () => {
    expect(validatePassword('password').valid).toBe(false)
    expect(validatePassword('Password1').valid).toBe(true)
  })

  it('validates password confirmation', () => {
    expect(validatePasswordConfirmation('Password1', 'Password2').valid).toBe(false)
    expect(validatePasswordConfirmation('Password1', 'Password1').valid).toBe(true)
  })

  it('validates seat selection', () => {
    expect(validateSeatSelection([]).valid).toBe(false)
    expect(validateSeatSelection([1]).valid).toBe(true)
  })
})
