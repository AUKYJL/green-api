import { create } from 'zustand'

import type {
  GreenApiCredentials,
  InstanceSettings,
} from '@/shared/api/green-api/types'
import type { Chat } from '@/features/create-chat/create-chat'
import type { OutgoingMessage } from '@/features/send-message/send-message'

export type IncomingMessage = {
  id: string
  chatId: string
  text: string
  direction: 'incoming'
  timestamp: number
}

type Message = OutgoingMessage | IncomingMessage

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
  hasProcessedIncoming: (id: string) => boolean
  markIncomingProcessed: (id: string) => void
}

export const useSessionStore = create<SessionStore>((set, get) => ({
  credentials: null,
  settings: null,
  activeChat: null,
  messages: [],
  setSession: (credentials, settings) => set({ credentials, settings }),
  processedIncomingIds: new Set(),
  clearSession: () => set({ credentials: null, settings: null, activeChat: null, messages: [], processedIncomingIds: new Set() }),
  setActiveChat: (activeChat) => set({ activeChat }),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  addIncoming: (message) => set((state) => state.processedIncomingIds.has(message.id)
    ? state
    : { messages: [...state.messages, message] }),
  hasProcessedIncoming: (id) => get().processedIncomingIds.has(id),
  markIncomingProcessed: (id) => set((state) => {
    if (state.processedIncomingIds.has(id)) return state
    const processedIncomingIds = new Set(state.processedIncomingIds)
    processedIncomingIds.add(id)
    return { processedIncomingIds }
  }),
}))
