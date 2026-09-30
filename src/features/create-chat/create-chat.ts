import axios from 'axios'

import { checkAccount } from '@/shared/api/green-api/chat'
import type { GreenApiCredentials } from '@/shared/api/green-api/types'
import { isSupportedMaxPhone, normalizePhone } from '@/shared/lib/normalize-phone'

export type Chat = {
  chatId: string
  phone: string
}

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

function getCreateChatErrorMessage(error: unknown) {
  if (axios.isAxiosError(error) && error.response?.status === 429) {
    return 'Превышен лимит запросов GREEN-API. Повторите попытку позже.'
  }
  return 'Не удалось проверить номер в GREEN-API. Повторите попытку.'
}
