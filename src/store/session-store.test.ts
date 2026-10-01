import { beforeEach, describe, expect, it } from 'vitest'

import { useSessionStore } from './session-store'

describe('session store incoming messages', () => {
  beforeEach(() => useSessionStore.getState().clearSession())

  it('adds an incoming message and marks it processed atomically', () => {
    const message = {
      id: 'incoming-1',
      chatId: 'chat-1',
      text: 'Привет',
      direction: 'incoming' as const,
      timestamp: 1,
    }

    useSessionStore.getState().addIncoming(message)
    useSessionStore.getState().addIncoming(message)

    const state = useSessionStore.getState()
    expect(state.messages).toEqual([message])
    expect(state.processedIncomingIds).toEqual(new Set(['incoming-1']))
  })

  it('does not add messages when a chat opens', () => {
    useSessionStore.getState().setActiveChat({ chatId: 'chat-1' })

    expect(useSessionStore.getState().messages).toEqual([])
  })
})
