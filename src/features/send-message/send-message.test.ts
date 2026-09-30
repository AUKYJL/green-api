import { describe, expect, it, vi } from 'vitest'

import { sendMessage } from '@/shared/api/green-api/chat'

import { sendChatMessage } from './send-message'

vi.mock('@/shared/api/green-api/chat', () => ({ sendMessage: vi.fn() }))

const credentials = { apiUrl: 'https://api.example.test', idInstance: '123', apiTokenInstance: 'secret' }
const chat = { chatId: '10000000', phone: '79991234567' }

describe('sendChatMessage', () => {
  it('adds a message only after GREEN-API returns its id', async () => {
    vi.mocked(sendMessage).mockResolvedValue({ idMessage: 'outgoing-id' })

    await expect(sendChatMessage(credentials, chat, ' Привет ')).resolves.toMatchObject({ id: 'outgoing-id', chatId: chat.chatId, text: 'Привет' })
    expect(sendMessage).toHaveBeenCalledWith(credentials, chat.chatId, 'Привет')
  })

  it('rejects a response without an id', async () => {
    vi.mocked(sendMessage).mockResolvedValue({})

    await expect(sendChatMessage(credentials, chat, 'Привет')).rejects.toThrow('идентификатор')
  })
})
