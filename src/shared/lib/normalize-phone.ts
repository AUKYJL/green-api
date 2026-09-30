export function normalizePhone(value: string) {
  return value.replace(/\D/g, '')
}

export function isSupportedMaxPhone(phone: string) {
  return (phone.startsWith('7') && phone.length === 11)
    || (phone.startsWith('375') && phone.length === 12)
}
