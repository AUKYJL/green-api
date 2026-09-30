import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { LogIn } from 'lucide-react'
import { toast } from 'sonner'

import { connectInstance } from './connect'
import type { ConnectionResult } from './connect'

const credentialsSchema = z.object({
  apiUrl: z.url('Введите корректный API URL.'),
  idInstance: z.string().trim().min(1, 'Введите ID инстанса.'),
  apiTokenInstance: z.string().min(1, 'Введите токен API.'),
})

type CredentialsFormValues = z.infer<typeof credentialsSchema>

type ConnectInstanceFormProps = {
  onConnected: (result: ConnectionResult) => void
}

export function ConnectInstanceForm({ onConnected }: ConnectInstanceFormProps) {
  const [error, setError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CredentialsFormValues>({ resolver: zodResolver(credentialsSchema) })

  async function onSubmit(values: CredentialsFormValues) {
    setError(null)
    try {
      const result = await connectInstance({
        ...values,
        apiUrl: values.apiUrl.trim(),
        idInstance: values.idInstance.trim(),
      })
      onConnected(result)
      toast.success('Инстанс подключён.')
    } catch (connectionError) {
      const message = connectionError instanceof Error ? connectionError.message : 'Не удалось подключиться.'
      setError(message)
      toast.error(message)
    }
  }

  return (
    <main className="connect-page">
      <section className="connect-card" aria-labelledby="connect-title">
        <p className="eyebrow">GREEN-API · MAX</p>
        <h1 id="connect-title">Подключите инстанс</h1>
        <p className="lead">Данные используются только в текущей сессии браузера.</p>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <label>API URL<input {...register('apiUrl')} type="url" placeholder="https://..." autoComplete="url" aria-invalid={Boolean(errors.apiUrl)} />{errors.apiUrl && <span className="field-error">{errors.apiUrl.message}</span>}</label>
          <label>ID инстанса<input {...register('idInstance')} inputMode="numeric" autoComplete="off" aria-invalid={Boolean(errors.idInstance)} />{errors.idInstance && <span className="field-error">{errors.idInstance.message}</span>}</label>
          <label>API-токен<input {...register('apiTokenInstance')} type="password" autoComplete="off" aria-invalid={Boolean(errors.apiTokenInstance)} />{errors.apiTokenInstance && <span className="field-error">{errors.apiTokenInstance.message}</span>}</label>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Проверяем…' : <><LogIn size={17} aria-hidden="true" />Подключиться</>}</button>
        </form>
      </section>
    </main>
  )
}
