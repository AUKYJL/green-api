import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { MessageComposer } from './MessageComposer'
import { sendChatMessage } from './send-message'

vi.mock('./send-message', () => ({ sendChatMessage: vi.fn() }))

describe('MessageComposer', () => {
  it('keeps the draft when sending fails', async () => {
    vi.mocked(sendChatMessage).mockRejectedValue(new Error('Не удалось отправить сообщение.'))
    const user = userEvent.setup()

    render(
      <MessageComposer
        credentials={{ apiUrl: 'https://api.example.test', idInstance: '123', apiTokenInstance: 'secret' }}
        chat={{ chatId: '10000000', phone: '79991234567' }}
        onSent={vi.fn()}
      />,
    )

    const composer = screen.getByRole('textbox', { name: 'Сообщение' })
    await user.type(composer, 'Привет')
    await user.click(screen.getByRole('button', { name: 'Отправить' }))

    expect(composer).toHaveValue('Привет')
    expect(screen.getByRole('alert')).toHaveTextContent('Не удалось отправить сообщение.')
  })
})
