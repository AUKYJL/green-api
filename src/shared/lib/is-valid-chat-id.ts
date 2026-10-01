export function isValidChatId(value: string) {
  return /^-?\d+$/.test(value.trim())
}
