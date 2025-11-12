export function normalizeIranPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (!digits) {
    throw new Error('Invalid phone number');
  }

  if (digits.startsWith('98')) {
    return `+${digits}`;
  }

  if (digits.startsWith('0')) {
    return `+98${digits.slice(1)}`;
  }

  if (digits.startsWith('9') && digits.length === 10) {
    return `+98${digits}`;
  }

  if (digits.startsWith('9') && digits.length === 12) {
    return `+${digits}`;
  }

  if (digits.startsWith('0098')) {
    return `+${digits.slice(2)}`;
  }

  return `+${digits}`;
}
