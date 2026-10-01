import { beforeEach, describe, expect, it, vi } from 'vitest'

import { checkAccount } from '@/shared/api/green-api/chat'

import { CreateChatError, createChat, createChatById } from './create-chat'

vi.mock('@/shared/api/green-api/chat', () => ({ checkAccount: vi.fn() }))

const credentials = { apiUrl: 'https://api.example.test', idInstance: '123', apiTokenInstance: 'secret' }

describe('createChat', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('normalizes a number and keeps the returned chat id', async () => {
    vi.mocked(checkAccount).mockResolvedValue({ exist: true, chatId: '10000000' })

    await expect(createChat(credentials, '+7 (999) 123-45-67')).resolves.toEqual({ chatId: '10000000', phone: '79991234567' })
    expect(checkAccount).toHaveBeenCalledWith(credentials, '79991234567')
  })

  it('shows a user-friendly error when the account does not exist', async () => {
    vi.mocked(checkAccount).mockResolvedValue({ exist: false })

    await expect(createChat(credentials, '79991234567')).rejects.toThrow('не найден')
  })

  it('opens a chat directly by a positive chat id without checking the account', () => {
    expect(createChatById('10000000')).toEqual({ chatId: '10000000' })
    expect(checkAccount).not.toHaveBeenCalled()
  })

  it('opens a group chat by a negative chat id', () => {
    expect(createChatById('-72109292096026')).toEqual({ chatId: '-72109292096026' })
  })

  it('trims a direct chat id', () => {
    expect(createChatById('  -72109292096026  ')).toEqual({ chatId: '-72109292096026' })
  })

  it('rejects an invalid direct chat id', () => {
    expect(() => createChatById('group-123')).toThrow(CreateChatError)
    expect(() => createChatById('group-123')).toThrow('Введите корректный числовой chatId.')
  })
})
