import { getSettings, getStateInstance } from '@/shared/api/green-api/account'
import { getGreenApiErrorKind } from '@/shared/api/green-api/errors'
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
  switch (getGreenApiErrorKind(error)) {
    case 'rate-limit':
      return 'Превышен лимит запросов GREEN-API. Повторите попытку позже.'
    case 'server':
      return 'GREEN-API временно недоступен. Повторите попытку позже.'
    case 'client':
      return 'Проверьте API URL, ID инстанса и токен.'
    case 'network':
      return 'Не удалось соединиться с GREEN-API. Проверьте API URL и интернет-соединение.'
    default:
      return 'Не удалось проверить подключение. Повторите попытку.'
  }
}
