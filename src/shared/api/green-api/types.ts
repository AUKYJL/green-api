export type GreenApiCredentials = {
  apiUrl: string
  idInstance: string
  apiTokenInstance: string
}

export type InstanceState = {
  stateInstance: InstanceStateValue
}

export type InstanceStateValue =
  | 'authorized'
  | 'notAuthorized'
  | 'blocked'
  | 'starting'
  | (string & {})

export type InstanceSettings = {
  webhookUrl?: string
  incomingWebhook?: IncomingWebhookValue
}

export type IncomingWebhookValue = 'yes' | 'no' | (string & {})

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
