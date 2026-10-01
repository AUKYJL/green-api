import { NewChatForm } from '@/features/create-chat/NewChatForm'
import { MessageComposer } from '@/features/send-message/MessageComposer'
import { LogOut, MessageCircle, Radio } from 'lucide-react'
import { useSessionStore } from '@/store/session-store'
import { MessageList } from './MessageList'

type MessengerProps = {
  isReceivingDegraded: boolean
}

export function Messenger({ isReceivingDegraded }: MessengerProps) {
  const credentials = useSessionStore((state) => state.credentials)
  const settings = useSessionStore((state) => state.settings)
  const activeChat = useSessionStore((state) => state.activeChat)
  const messages = useSessionStore((state) => state.messages)
  const setActiveChat = useSessionStore((state) => state.setActiveChat)
  const addMessage = useSessionStore((state) => state.addMessage)
  const clearSession = useSessionStore((state) => state.clearSession)

  if (!credentials || !settings) return null

  const receivingReady = settings.webhookUrl === '' && settings.incomingWebhook === 'yes'
  const chatMessages = activeChat ? messages.filter((message) => message.chatId === activeChat.chatId) : []

  return (
    <main className="messenger-page">
      <header className="messenger-header">
        <div><p className="eyebrow">GREEN-API · MAX</p><h1>Чаты</h1></div>
        <button className="secondary-button" type="button" onClick={clearSession}><LogOut size={17} aria-hidden="true" />Выйти</button>
      </header>
      {!receivingReady && <div className="settings-warning" role="status"><strong>Входящие сообщения пока не настроены.</strong><p>В панели GREEN-API установите пустой webhookUrl и incomingWebhook: yes.</p></div>}
      {receivingReady && isReceivingDegraded && <div className="settings-warning" role="status">Получение сообщений временно недоступно. Повторяем подключение…</div>}
      <section className="chat-shell">
        <aside className="chat-sidebar"><div className="sidebar-heading"><MessageCircle size={19} aria-hidden="true" /><h2>Новый чат</h2></div><p className="muted">Введите номер пользователя MAX.</p><NewChatForm credentials={credentials} onCreated={setActiveChat} /></aside>
        <section className="active-chat" aria-live="polite">
          {activeChat ? (
            <>
              <header className="chat-title"><div><h2>{activeChat.name ?? activeChat.phone ?? activeChat.chatId}</h2><p>MAX</p></div><span className="chat-status"><Radio size={13} aria-hidden="true" />Чат MAX</span></header>
              <MessageList messages={chatMessages} />
              <MessageComposer credentials={credentials} chat={activeChat} onSent={addMessage} />
            </>
          ) : <div className="chat-placeholder"><MessageCircle size={34} aria-hidden="true" /><h2>Откройте чат</h2><p className="muted">Введите номер получателя слева, чтобы проверить его в MAX.</p></div>}
        </section>
      </section>
    </main>
  )
}
