import { describe, expect, it } from 'vitest'

import { isSupportedMaxPhone, normalizePhone } from './normalize-phone'

describe('phone normalization', () => {
  it('removes formatting characters', () => {
    expect(normalizePhone('+7 (999) 123-45-67')).toBe('79991234567')
  })

  it.each(['79991234567', '375291234567'])('accepts supported MAX number %s', (phone) => {
    expect(isSupportedMaxPhone(phone)).toBe(true)
  })

  it.each(['7999123456', '37529123456', '380991234567'])('rejects unsupported number %s', (phone) => {
    expect(isSupportedMaxPhone(phone)).toBe(false)
  })
})
