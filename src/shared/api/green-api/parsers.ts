import type { NotificationBody } from './types'

export type IncomingTextNotification = {
  id: string
  chatId: string
  text: string
  timestamp: number
}

export function extractIncomingText(body: NotificationBody | null | undefined): IncomingTextNotification | null {
  if (!body) return null
  if (body.typeWebhook !== 'incomingMessageReceived') return null

  const messageData = body.messageData
  const text = messageData?.typeMessage === 'textMessage'
    ? messageData.textMessageData?.textMessage
    : messageData?.typeMessage === 'extendedTextMessage'
      ? messageData.extendedTextMessageData?.text
      : undefined

  if (!body.idMessage || !body.senderData?.chatId || typeof text !== 'string') return null

  return {
    id: body.idMessage,
    chatId: body.senderData.chatId,
    text,
    timestamp: typeof body.timestamp === 'number' ? body.timestamp * 1000 : Date.now(),
  }
}
