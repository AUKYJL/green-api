import { describe, expect, it, vi } from 'vitest'

import { getSettings, getStateInstance } from '@/shared/api/green-api/account'

import { connectInstance } from './connect'

vi.mock('@/shared/api/green-api/account', () => ({
  getStateInstance: vi.fn(),
  getSettings: vi.fn(),
}))

const credentials = { apiUrl: 'https://api.example.test', idInstance: '123', apiTokenInstance: 'secret' }

describe('connectInstance', () => {
  it('loads settings only after an authorized state', async () => {
    vi.mocked(getStateInstance).mockResolvedValue({ stateInstance: 'authorized' })
    vi.mocked(getSettings).mockResolvedValue({ webhookUrl: '', incomingWebhook: 'yes' })
    await expect(connectInstance(credentials)).resolves.toMatchObject({ credentials })
    expect(getSettings).toHaveBeenCalledWith(credentials)
  })

  it('rejects a non-authorized instance without loading settings', async () => {
    vi.mocked(getStateInstance).mockResolvedValue({ stateInstance: 'blocked' })
    await expect(connectInstance(credentials)).rejects.toThrow('заблокирован')
    expect(getSettings).not.toHaveBeenCalled()
  })
})
