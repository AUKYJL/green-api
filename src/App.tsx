import { ConnectInstanceForm } from '@/features/connect-instance/ConnectInstanceForm'
import type { ConnectionResult } from '@/features/connect-instance/connect'
import { Messenger } from '@/features/messenger/Messenger'
import { useNotificationConsumer } from '@/features/receive-notifications/use-notification-consumer'
import { useSessionStore } from '@/store/session-store'
import { Toaster } from 'sonner'

import './App.css'

function App() {
  const credentials = useSessionStore((state) => state.credentials)
  const setSession = useSessionStore((state) => state.setSession)
  const isReceivingDegraded = useNotificationConsumer()

  function handleConnected({ credentials: nextCredentials, settings: nextSettings }: ConnectionResult) {
    setSession(nextCredentials, nextSettings)
  }

  return (
    <>
      {credentials
        ? <Messenger isReceivingDegraded={isReceivingDegraded} />
        : <ConnectInstanceForm onConnected={handleConnected} />}
      <Toaster position="top-right" richColors closeButton />
    </>
  )
}

export default App
