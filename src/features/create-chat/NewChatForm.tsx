import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { MessageCirclePlus } from 'lucide-react'
import { toast } from 'sonner'

import { DevChatIdForm } from './DevChatIdForm'
import { createChat } from './create-chat'
import type { Chat } from '@/entities/chat'
import type { GreenApiCredentials } from '@/shared/api/green-api/types'
import { isSupportedMaxPhone, normalizePhone } from '@/shared/lib/normalize-phone'

const newChatSchema = z.object({
  phone: z.string().refine(
    (value) => isSupportedMaxPhone(normalizePhone(value)),
    'Введите номер РФ или Беларуси: 11 цифр с 7 либо 12 цифр с 375.',
  ),
})

type NewChatFormProps = {
  credentials: GreenApiCredentials
  onCreated: (chat: Chat) => void
}

type NewChatValues = z.infer<typeof newChatSchema>
export function NewChatForm({ credentials, onCreated }: NewChatFormProps) {
  const [error, setError] = useState<string | null>(null)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<NewChatValues>({
    resolver: zodResolver(newChatSchema),
  })

  async function onSubmit({ phone }: NewChatValues) {
    setError(null)
    try {
      const chat = await createChat(credentials, phone)
      onCreated(chat)
      toast.success('Чат открыт.')
    } catch (creationError) {
      const message = creationError instanceof Error ? creationError.message : 'Не удалось создать чат.'
      setError(message)
    }
  }

  return (
    <>
      <form className="new-chat-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <label htmlFor="new-chat-phone">Номер получателя</label>
        <div className="new-chat-controls">
          <input id="new-chat-phone" {...register('phone')} inputMode="tel" placeholder="+7 999 123-45-67" aria-invalid={Boolean(errors.phone)} />
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              'Проверяем…'
            ) : (
              <>
                <MessageCirclePlus size={17} aria-hidden="true" />
                Открыть чат
              </>
            )}
          </button>
        </div>
        {errors.phone && <p className="field-error">{errors.phone.message}</p>}
        {error && <p className="form-error" role="alert">{error}</p>}
      </form>
      {import.meta.env.DEV && <DevChatIdForm onCreated={onCreated} />}
    </>
  )
}
