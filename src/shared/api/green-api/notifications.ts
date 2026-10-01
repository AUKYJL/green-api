import { buildGreenApiUrl, greenApiHttp } from './client'
import type { GreenApiCredentials, NotificationEnvelope } from './types'

const RECEIVE_TIMEOUT_SECONDS = 5

export async function receiveNotification(
  credentials: GreenApiCredentials,
  signal?: AbortSignal,
) {
  const response = await greenApiHttp.get<NotificationEnvelope | null>(
    buildGreenApiUrl(credentials, 'receiveNotification'),
    {
      params: { receiveTimeout: RECEIVE_TIMEOUT_SECONDS },
      signal,
      timeout: (RECEIVE_TIMEOUT_SECONDS + 10) * 1000,
    },
  )

  return response.data
}

export async function deleteNotification(
  credentials: GreenApiCredentials,
  receiptId: number,
  signal?: AbortSignal,
) {
  await greenApiHttp.delete(
    `${buildGreenApiUrl(credentials, 'deleteNotification')}/${encodeURIComponent(String(receiptId))}`,
    { signal },
  )
}
