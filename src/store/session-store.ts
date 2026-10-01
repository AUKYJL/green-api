import { create } from 'zustand'

import type { Chat } from '@/entities/chat'
import type { IncomingMessage, Message } from '@/entities/message'
import type {
  GreenApiCredentials,
  InstanceSettings,
} from '@/shared/api/green-api/types'

type SessionStore = {
  credentials: GreenApiCredentials | null
  settings: InstanceSettings | null
  activeChat: Chat | null
  messages: Message[]
  processedIncomingIds: Set<string>
  setSession: (credentials: GreenApiCredentials, settings: InstanceSettings) => void
  clearSession: () => void
  setActiveChat: (chat: Chat) => void
  addMessage: (message: Message) => void
  addIncoming: (message: IncomingMessage) => void
}

export const useSessionStore = create<SessionStore>((set) => ({
  credentials: null,
  settings: null,
  activeChat: null,
  messages: [],
  processedIncomingIds: new Set(),
  setSession: (credentials, settings) => set({ credentials, settings }),
  clearSession: () => set({ credentials: null, settings: null, activeChat: null, messages: [], processedIncomingIds: new Set() }),
  setActiveChat: (activeChat) => set((state) => {
    const timestamp = Date.now()
    const initialMessages: Message[] = [
      { id: `${activeChat.chatId}-initial-incoming-${timestamp}`, chatId: activeChat.chatId, text: 'прив', direction: 'incoming', timestamp },
      { id: `${activeChat.chatId}-initial-outgoing-${timestamp}`, chatId: activeChat.chatId, text: 'прив', direction: 'outgoing', timestamp: timestamp + 1 },
    ]
    return { activeChat, messages: [...state.messages, ...initialMessages] }
  }),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  addIncoming: (message) => set((state) => {
    if (state.processedIncomingIds.has(message.id)) return state
    const processedIncomingIds = new Set(state.processedIncomingIds)
    processedIncomingIds.add(message.id)
    return { messages: [...state.messages, message], processedIncomingIds }
  }),
}))
