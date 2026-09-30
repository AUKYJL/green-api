import { beforeEach, describe, expect, it, vi } from 'vitest'

import { deleteNotification, receiveNotification } from '@/shared/api/green-api/notifications'

import { processNotification, runNotificationConsumer } from './notification-consumer'

vi.mock('@/shared/api/green-api/notifications', () => ({
  deleteNotification: vi.fn(),
  receiveNotification: vi.fn(),
}))

const credentials = { apiUrl: 'https://api.example.test', idInstance: '123', apiTokenInstance: 'secret' }

function callbacks() {
  const processed = new Set<string>()
  const messages: Array<{ id: string }> = []
  return {
    messages,
    callbacks: {
      addIncoming: (message: { id: string }) => messages.push(message),
      hasProcessed: (id: string) => processed.has(id),
      markProcessed: (id: string) => processed.add(id),
    },
  }
}

const textNotification = {
  receiptId: 42,
  body: {
    typeWebhook: 'incomingMessageReceived',
    idMessage: 'incoming-1',
    senderData: { chatId: 'chat-1' },
    messageData: { typeMessage: 'textMessage', textMessageData: { textMessage: 'Привет' } },
  },
}

describe('notification consumer', () => {
  beforeEach(() => vi.clearAllMocks())

  it('adds a supported incoming message before acknowledging it', async () => {
    const test = callbacks()
    vi.mocked(deleteNotification).mockImplementation(async () => {
      expect(test.messages).toHaveLength(1)
    })

    await processNotification(textNotification, credentials, test.callbacks)

    expect(test.messages).toHaveLength(1)
    expect(deleteNotification).toHaveBeenCalledWith(credentials, 42, undefined)
  })

  it('acknowledges ignored notifications', async () => {
    const test = callbacks()
    vi.mocked(deleteNotification).mockResolvedValue(undefined)

    await processNotification({ receiptId: 43, body: { typeWebhook: 'statusInstanceChanged' } }, credentials, test.callbacks)

    expect(test.messages).toHaveLength(0)
    expect(deleteNotification).toHaveBeenCalledWith(credentials, 43, undefined)
  })

  it('does not duplicate a redelivered message when delete initially fails', async () => {
    const test = callbacks()
    vi.mocked(deleteNotification)
      .mockRejectedValueOnce(new Error('network'))
      .mockResolvedValueOnce(undefined)

    await expect(processNotification(textNotification, credentials, test.callbacks)).rejects.toThrow('network')
    await processNotification(textNotification, credentials, test.callbacks)

    expect(test.messages).toHaveLength(1)
  })

  it('stops after aborting an in-flight receive', async () => {
    vi.mocked(receiveNotification).mockImplementation((_, __, signal) => new Promise((_, reject) => {
      signal?.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')), { once: true })
    }))
    const controller = new AbortController()
    const running = runNotificationConsumer(credentials, callbacks().callbacks, controller.signal)

    controller.abort()
    await expect(running).resolves.toBeUndefined()
    expect(receiveNotification).toHaveBeenCalledTimes(1)
  })
})
