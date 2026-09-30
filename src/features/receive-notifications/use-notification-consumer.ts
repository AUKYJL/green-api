import { useEffect, useState } from 'react'

import { runNotificationConsumer } from './notification-consumer'
import { useSessionStore } from '@/store/session-store'

export function useNotificationConsumer() {
  const credentials = useSessionStore((state) => state.credentials)
  const settings = useSessionStore((state) => state.settings)
  const addIncoming = useSessionStore((state) => state.addIncoming)
  const hasProcessed = useSessionStore((state) => state.hasProcessedIncoming)
  const markProcessed = useSessionStore((state) => state.markIncomingProcessed)
  const [isDegraded, setIsDegraded] = useState(false)
  const receivingReady = Boolean(credentials && settings?.webhookUrl === '' && settings.incomingWebhook === 'yes')

  useEffect(() => {
    if (!credentials || !receivingReady) return

    const controller = new AbortController()
    void runNotificationConsumer(credentials, {
      addIncoming,
      hasProcessed,
      markProcessed,
      onDegraded: () => setIsDegraded(true),
      onRecovered: () => setIsDegraded(false),
    }, controller.signal)

    return () => controller.abort()
  }, [credentials, receivingReady, addIncoming, hasProcessed, markProcessed])

  return receivingReady && isDegraded
}
