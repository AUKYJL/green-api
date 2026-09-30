import { buildGreenApiUrl, greenApiHttp } from './client'
import type {
  CheckAccountResponse,
  GreenApiCredentials,
  SendMessageResponse,
} from './types'

export async function checkAccount(
  credentials: GreenApiCredentials,
  phoneNumber: string,
) {
  const response = await greenApiHttp.post<CheckAccountResponse>(
    buildGreenApiUrl(credentials, 'checkAccount'),
    { phoneNumber: Number(phoneNumber) },
  )

  return response.data
}

export async function sendMessage(
  credentials: GreenApiCredentials,
  chatId: string,
  message: string,
) {
  const response = await greenApiHttp.post<SendMessageResponse>(
    buildGreenApiUrl(credentials, 'sendMessage'),
    { chatId, message },
  )

  return response.data
}
