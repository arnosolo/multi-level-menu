export function generateRandomString() {
  return `${Date.now().toString()}-${Math.random().toString(36).slice(-8)}`
  // return `${Math.random().toString(36).slice(-8)}`
}
