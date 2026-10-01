import type { Chat } from '@/entities/chat'
import type { OutgoingMessage } from '@/entities/message'
import { sendMessage } from '@/shared/api/green-api/chat'
import { getGreenApiErrorKind } from '@/shared/api/green-api/errors'
import type { GreenApiCredentials } from '@/shared/api/green-api/types'

export type { OutgoingMessage } from '@/entities/message'

export class SendMessageError extends Error {}

export async function sendChatMessage(
  credentials: GreenApiCredentials,
  chat: Chat,
  text: string,
): Promise<OutgoingMessage> {
  const message = text.trim()
  if (!message) {
    throw new SendMessageError('Введите текст сообщения.')
  }

  try {
    const result = await sendMessage(credentials, chat.chatId, message)
    if (!result.idMessage) {
      throw new SendMessageError('GREEN-API не вернул идентификатор сообщения.')
    }
    return {
      id: result.idMessage,
      chatId: chat.chatId,
      text: message,
      direction: 'outgoing',
      timestamp: Date.now(),
    }
  } catch (error) {
    if (error instanceof SendMessageError) {
      throw error
    }
    throw new SendMessageError(getSendErrorMessage(error))
  }
}

function getSendErrorMessage(error: unknown) {
  if (getGreenApiErrorKind(error) === 'rate-limit') {
    return 'Превышен лимит отправки GREEN-API. Повторите попытку позже.'
  }
  return 'Не удалось отправить сообщение. Проверьте соединение и повторите попытку.'
}
