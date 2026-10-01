import axios from 'axios'

import { deleteNotification, receiveNotification } from '@/shared/api/green-api/notifications'
import { extractIncomingText } from '@/shared/api/green-api/parsers'
import type { GreenApiCredentials, NotificationEnvelope } from '@/shared/api/green-api/types'
import type { IncomingMessage } from '@/entities/message'

type ConsumerCallbacks = {
  addIncoming: (message: IncomingMessage) => void
  onDegraded?: () => void
  onRecovered?: () => void
}

const RETRY_DELAY_MS = 1_500

function waitForRetry(signal: AbortSignal) {
  return new Promise<void>((resolve) => {
    const finish = () => {
      window.clearTimeout(timeout)
      signal.removeEventListener('abort', finish)
      resolve()
    }
    const timeout = window.setTimeout(finish, RETRY_DELAY_MS)
    signal.addEventListener('abort', finish, { once: true })
  })
}

export async function processNotification(
  notification: NotificationEnvelope,
  credentials: GreenApiCredentials,
  callbacks: ConsumerCallbacks,
  signal?: AbortSignal,
) {
  const incoming = extractIncomingText(notification.body)
  if (incoming) {
    callbacks.addIncoming({ ...incoming, direction: 'incoming' })
  }
  await deleteNotification(credentials, notification.receiptId, signal)
}

export async function runNotificationConsumer(
  credentials: GreenApiCredentials,
  callbacks: ConsumerCallbacks,
  signal: AbortSignal,
) {
  while (!signal.aborted) {
    try {
      const notification = await receiveNotification(credentials, signal)
      if (signal.aborted) return
      if (!notification) {
        callbacks.onRecovered?.()
        continue
      }

      await processNotification(notification, credentials, callbacks, signal)
      callbacks.onRecovered?.()
    } catch (error) {
      if (signal.aborted || axios.isCancel(error) || (error instanceof DOMException && error.name === 'AbortError')) {
        return
      }
      callbacks.onDegraded?.()
      await waitForRetry(signal)
    }
  }
}
