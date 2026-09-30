export type GreenApiCredentials = {
  apiUrl: string
  idInstance: string
  apiTokenInstance: string
}

export type InstanceState = {
  stateInstance: string
}

export type InstanceSettings = {
  webhookUrl?: string
  incomingWebhook?: string
}

export type CheckAccountResponse = {
  exist: boolean
  chatId?: string
}

export type SendMessageResponse = {
  idMessage?: string
}

export type NotificationEnvelope = {
  receiptId: number
  body?: NotificationBody
}

export type NotificationBody = {
  typeWebhook?: string
  idMessage?: string
  timestamp?: number
  senderData?: { chatId?: string }
  messageData?: {
    typeMessage?: string
    textMessageData?: { textMessage?: string }
    extendedTextMessageData?: { text?: string }
  }
}
