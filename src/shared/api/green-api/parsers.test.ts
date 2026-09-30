import { describe, expect, it } from 'vitest'

import { extractIncomingText } from './parsers'

describe('extractIncomingText', () => {
  it('extracts a text message', () => {
    expect(extractIncomingText({
      typeWebhook: 'incomingMessageReceived',
      idMessage: 'message-1',
      timestamp: 1_700_000_000,
      senderData: { chatId: 'chat-1' },
      messageData: { typeMessage: 'textMessage', textMessageData: { textMessage: 'Привет' } },
    })).toMatchObject({ id: 'message-1', chatId: 'chat-1', text: 'Привет', timestamp: 1_700_000_000_000 })
  })

  it('extracts an extended text message', () => {
    expect(extractIncomingText({
      typeWebhook: 'incomingMessageReceived',
      idMessage: 'message-2',
      senderData: { chatId: 'chat-1' },
      messageData: { typeMessage: 'extendedTextMessage', extendedTextMessageData: { text: 'https://example.test' } },
    })).toMatchObject({ id: 'message-2', text: 'https://example.test' })
  })

  it('ignores unknown notifications without throwing', () => {
    expect(() => extractIncomingText({ typeWebhook: 'outgoingMessageReceived' })).not.toThrow()
    expect(extractIncomingText({ typeWebhook: 'outgoingMessageReceived' })).toBeNull()
    expect(extractIncomingText(undefined)).toBeNull()
  })
})
