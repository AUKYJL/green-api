import type { Chat } from '@/entities/chat'
import { checkAccount } from '@/shared/api/green-api/chat'
import { getGreenApiErrorKind } from '@/shared/api/green-api/errors'
import type { GreenApiCredentials } from '@/shared/api/green-api/types'
import { isValidChatId } from '@/shared/lib/is-valid-chat-id'
import { isSupportedMaxPhone, normalizePhone } from '@/shared/lib/normalize-phone'

export type { Chat } from '@/entities/chat'

export class CreateChatError extends Error {}

export async function createChat(credentials: GreenApiCredentials, inputPhone: string): Promise<Chat> {
  const phone = normalizePhone(inputPhone)

  if (!isSupportedMaxPhone(phone)) {
    throw new CreateChatError('Введите номер РФ или Беларуси: 11 цифр с 7 либо 12 цифр с 375.')
  }

  try {
    const result = await checkAccount(credentials, phone)
    if (!result.exist || !result.chatId) {
      throw new CreateChatError('Пользователь с этим номером не найден в MAX.')
    }

    return { chatId: result.chatId, phone }
  } catch (error) {
    if (error instanceof CreateChatError) {
      throw error
    }
    throw new CreateChatError(getCreateChatErrorMessage(error))
  }
}

export function createChatById(inputChatId: string): Chat {
  const chatId = inputChatId.trim()

  if (!isValidChatId(chatId)) {
    throw new CreateChatError('Введите корректный числовой chatId.')
  }

  return { chatId }
}

function getCreateChatErrorMessage(error: unknown) {
  if (getGreenApiErrorKind(error) === 'rate-limit') {
    return 'Превышен лимит запросов GREEN-API. Повторите попытку позже.'
  }
  return 'Не удалось проверить номер в GREEN-API. Повторите попытку.'
}
