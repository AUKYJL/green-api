import axios from 'axios'

import { deleteNotification, receiveNotification } from '@/shared/api/green-api/notifications'
import { extractIncomingText } from '@/shared/api/green-api/parsers'
import type { GreenApiCredentials, NotificationEnvelope } from '@/shared/api/green-api/types'
import type { IncomingMessage } from '@/store/session-store'

type ConsumerCallbacks = {
  addIncoming: (message: IncomingMessage) => void
  hasProcessed: (id: string) => boolean
  markProcessed: (id: string) => void
  onDegraded?: () => void
  onRecovered?: () => void
}

const RETRY_DELAY_MS = 1_500

function waitForRetry(signal: AbortSignal) {
  return new Promise<void>((resolve) => {
    const timeout = window.setTimeout(resolve, RETRY_DELAY_MS)
    signal.addEventListener('abort', () => {
      window.clearTimeout(timeout)
      resolve()
    }, { once: true })
  })
}

export async function processNotification(
  notification: NotificationEnvelope,
  credentials: GreenApiCredentials,
  callbacks: ConsumerCallbacks,
  signal?: AbortSignal,
) {
  const incoming = extractIncomingText(notification.body)
  if (incoming && !callbacks.hasProcessed(incoming.id)) {
    callbacks.addIncoming({ ...incoming, direction: 'incoming' })
    callbacks.markProcessed(incoming.id)
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
      const notification = await receiveNotification(credentials, 5, signal)
      if (signal.aborted || !notification) continue

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
