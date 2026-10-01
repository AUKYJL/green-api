import { useEffect, useRef } from 'react'

import type { Message } from '@/entities/message'

type MessageListProps = { messages: Message[] }

const timeFormatter = new Intl.DateTimeFormat('ru-RU', { hour: '2-digit', minute: '2-digit' })

function formatTime(timestamp: number) {
  return timeFormatter.format(timestamp)
}

export function MessageList({ messages }: MessageListProps) {
  const areaRef = useRef<HTMLDivElement>(null)
  const shouldFollowRef = useRef(true)

  useEffect(() => {
    const area = areaRef.current
    if (area && shouldFollowRef.current) area.scrollTop = area.scrollHeight
  }, [messages])

  function handleScroll() {
    const area = areaRef.current
    if (!area) return
    shouldFollowRef.current = area.scrollHeight - area.scrollTop - area.clientHeight < 48
  }

  return (
    <div className="message-area" ref={areaRef} onScroll={handleScroll} aria-label="Сообщения">
      {messages.length === 0
        ? <div className="messages-empty"><p>Пока нет сообщений</p><span>Напишите первое сообщение, чтобы начать диалог.</span></div>
        : messages.map((message) => (
          <article className={`message ${message.direction}`} key={message.id}>
            <p>{message.text}</p><time dateTime={new Date(message.timestamp).toISOString()}>{formatTime(message.timestamp)}</time>
          </article>
        ))}
    </div>
  )
}
