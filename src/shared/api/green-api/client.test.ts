import { describe, expect, it } from 'vitest'

import { buildGreenApiUrl } from './client'

describe('buildGreenApiUrl', () => {
  it('builds the documented instance endpoint without duplicate slashes', () => {
    expect(
      buildGreenApiUrl(
        {
          apiUrl: 'https://api.example.test/',
          idInstance: '123',
          apiTokenInstance: 'token value',
        },
        'getStateInstance',
      ),
    ).toBe('https://api.example.test/waInstance123/getStateInstance/token%20value')
  })
})
