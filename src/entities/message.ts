export type MessageDirection = 'incoming' | 'outgoing'

export type Message = {
  id: string
  chatId: string
  text: string
  direction: MessageDirection
  timestamp: number
}

export type IncomingMessage = Message & {
  direction: 'incoming'
}

export type OutgoingMessage = Message & {
  direction: 'outgoing'
}
