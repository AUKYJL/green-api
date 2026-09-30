import { useState } from 'react'
import { SendHorizonal } from 'lucide-react'
import { toast } from 'sonner'

import type { Chat } from '@/features/create-chat/create-chat'
import { sendChatMessage } from './send-message'
import type { OutgoingMessage } from './send-message'
import type { GreenApiCredentials } from '@/shared/api/green-api/types'

type MessageComposerProps = {
  credentials: GreenApiCredentials
  chat: Chat
  onSent: (message: OutgoingMessage) => void
}

export function MessageComposer({ credentials, chat, onSent }: MessageComposerProps) {
  const [text, setText] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSending, setIsSending] = useState(false)

  async function submit() {
    if (!text.trim() || isSending) return

    setError(null)
    setIsSending(true)
    try {
      onSent(await sendChatMessage(credentials, chat, text))
      setText('')
    } catch (sendError) {
      const message = sendError instanceof Error ? sendError.message : 'Не удалось отправить сообщение.'
      setError(message)
      toast.error(message)
    } finally {
      setIsSending(false)
    }
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      void submit()
    }
  }

  return (
    <div className="composer">
      <textarea value={text} onChange={(event) => setText(event.target.value)} onKeyDown={onKeyDown} placeholder="Сообщение" rows={2} aria-label="Сообщение" />
      <button type="button" onClick={() => void submit()} disabled={!text.trim() || isSending}>{isSending ? 'Отправляем…' : <><SendHorizonal size={17} aria-hidden="true" />Отправить</>}</button>
      {error && <p className="form-error" role="alert">{error}</p>}
    </div>
  )
}
