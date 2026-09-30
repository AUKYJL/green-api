import axios from 'axios'

import type { GreenApiCredentials } from './types'

export const greenApiHttp = axios.create()

export function buildGreenApiUrl(
  { apiUrl, idInstance, apiTokenInstance }: GreenApiCredentials,
  method: string,
) {
  const baseUrl = apiUrl.replace(/\/+$/, '')

  return `${baseUrl}/waInstance${encodeURIComponent(idInstance)}/${method}/${encodeURIComponent(apiTokenInstance)}`
}
