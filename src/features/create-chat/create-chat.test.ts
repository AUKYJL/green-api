import { describe, expect, it, vi } from 'vitest'

import { checkAccount } from '@/shared/api/green-api/chat'

import { createChat } from './create-chat'

vi.mock('@/shared/api/green-api/chat', () => ({ checkAccount: vi.fn() }))

const credentials = { apiUrl: 'https://api.example.test', idInstance: '123', apiTokenInstance: 'secret' }

describe('createChat', () => {
  it('normalizes a number and keeps the returned chat id', async () => {
    vi.mocked(checkAccount).mockResolvedValue({ exist: true, chatId: '10000000' })

    await expect(createChat(credentials, '+7 (999) 123-45-67')).resolves.toEqual({ chatId: '10000000', phone: '79991234567' })
    expect(checkAccount).toHaveBeenCalledWith(credentials, '79991234567')
  })

  it('shows a user-friendly error when the account does not exist', async () => {
    vi.mocked(checkAccount).mockResolvedValue({ exist: false })

    await expect(createChat(credentials, '79991234567')).rejects.toThrow('не найден')
  })
})
