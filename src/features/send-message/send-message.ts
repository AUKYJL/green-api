import axios from 'axios'

import { sendMessage } from '@/shared/api/green-api/chat'
import type { GreenApiCredentials } from '@/shared/api/green-api/types'
import type { Chat } from '@/features/create-chat/create-chat'

export type OutgoingMessage = {
  id: string
  chatId: string
  text: string
  direction: 'outgoing'
  timestamp: number
}

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
  if (axios.isAxiosError(error) && error.response?.status === 429) {
    return 'Превышен лимит отправки GREEN-API. Повторите попытку позже.'
  }
  return 'Не удалось отправить сообщение. Проверьте соединение и повторите попытку.'
}
