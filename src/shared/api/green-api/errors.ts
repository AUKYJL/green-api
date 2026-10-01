import axios from 'axios'

export type GreenApiErrorKind =
  | 'rate-limit'
  | 'client'
  | 'server'
  | 'network'
  | 'unknown'

export function getGreenApiErrorKind(error: unknown): GreenApiErrorKind {
  if (!axios.isAxiosError(error)) return 'unknown'

  const status = error.response?.status
  if (status === 429) return 'rate-limit'
  if (status && status >= 500) return 'server'
  if (status && status >= 400) return 'client'
  if (error.request) return 'network'

  return 'unknown'
}
