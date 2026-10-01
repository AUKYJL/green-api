import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { toast } from 'sonner'

import { createChatById } from './create-chat'
import type { Chat } from '@/entities/chat'
import { isValidChatId } from '@/shared/lib/is-valid-chat-id'

const chatIdSchema = z.object({
  chatId: z.string().refine(isValidChatId, 'Введите корректный числовой chatId.'),
})

type ChatIdValues = z.infer<typeof chatIdSchema>

type DevChatIdFormProps = {
  onCreated: (chat: Chat) => void
}

export function DevChatIdForm({ onCreated }: DevChatIdFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ChatIdValues>({ resolver: zodResolver(chatIdSchema) })

  function onSubmit({ chatId }: ChatIdValues) {
    onCreated(createChatById(chatId))
    toast.success('Чат открыт.')
  }

  return (
    <div className="dev-chat-id">
      <p>Для тестирования</p>
      <form className="dev-chat-id-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <label htmlFor="new-chat-id">chatId</label>
        <div className="new-chat-controls">
          <input id="new-chat-id" {...register('chatId')} inputMode="numeric" placeholder="-72109292096026" aria-invalid={Boolean(errors.chatId)} />
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Открываем…' : 'Открыть по chatId'}
          </button>
        </div>
        {errors.chatId && <p className="field-error">{errors.chatId.message}</p>}
      </form>
    </div>
  )
}
