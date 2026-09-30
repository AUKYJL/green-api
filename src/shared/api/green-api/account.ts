import { buildGreenApiUrl, greenApiHttp } from './client'
import type {
  GreenApiCredentials,
  InstanceSettings,
  InstanceState,
} from './types'

export async function getStateInstance(credentials: GreenApiCredentials) {
  const response = await greenApiHttp.get<InstanceState>(
    buildGreenApiUrl(credentials, 'getStateInstance'),
  )

  return response.data
}

export async function getSettings(credentials: GreenApiCredentials) {
  const response = await greenApiHttp.get<InstanceSettings>(
    buildGreenApiUrl(credentials, 'getSettings'),
  )

  return response.data
}
