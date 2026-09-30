import axios from 'axios'

import { getSettings, getStateInstance } from '@/shared/api/green-api/account'
import type {
  GreenApiCredentials,
  InstanceSettings,
} from '@/shared/api/green-api/types'

export type ConnectionResult = {
  credentials: GreenApiCredentials
  settings: InstanceSettings
}

export class ConnectInstanceError extends Error {}

export async function connectInstance(
  credentials: GreenApiCredentials,
): Promise<ConnectionResult> {
  try {
    const state = await getStateInstance(credentials)

    if (state.stateInstance !== 'authorized') {
      throw new ConnectInstanceError(getStateMessage(state.stateInstance))
    }

    const settings = await getSettings(credentials)
    return { credentials, settings }
  } catch (error) {
    if (error instanceof ConnectInstanceError) {
      throw error
    }

    throw new ConnectInstanceError(getConnectionErrorMessage(error))
  }
}

function getStateMessage(state: string) {
  switch (state) {
    case 'notAuthorized':
      return 'Инстанс не авторизован. Авторизуйте его в GREEN-API и повторите попытку.'
    case 'blocked':
      return 'Инстанс заблокирован. Проверьте его статус в GREEN-API.'
    case 'starting':
      return 'Инстанс запускается. Подождите немного и повторите попытку.'
    default:
      return 'Инстанс не готов к работе. Проверьте его статус в GREEN-API.'
  }
}

function getConnectionErrorMessage(error: unknown) {
  if (!axios.isAxiosError(error)) {
    return 'Не удалось проверить подключение. Повторите попытку.'
  }

  if (error.response?.status === 429) {
    return 'Превышен лимит запросов GREEN-API. Повторите попытку позже.'
  }

  if (error.response?.status && error.response.status >= 500) {
    return 'GREEN-API временно недоступен. Повторите попытку позже.'
  }

  if (error.response?.status && error.response.status >= 400) {
    return 'Проверьте API URL, ID инстанса и токен.'
  }

  return 'Не удалось соединиться с GREEN-API. Проверьте API URL и интернет-соединение.'
}
