const ACCOUNTS_KEY = 'railbook-accounts'
const SESSION_KEY = 'railbook-session'

function getAccounts() {
  try {
    return JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || '{}')
  } catch {
    return {}
  }
}

function toHex(bytes) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')
}

function createSalt() {
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  return toHex(bytes)
}

async function hashPassword(password, salt) {
  const encoded = new TextEncoder().encode(`${salt}:${password}`)
  const hash = await crypto.subtle.digest('SHA-256', encoded)
  return toHex(new Uint8Array(hash))
}

function toUser(account) {
  const name = account.email.split('@')[0].replace(/[._-]/g, ' ')
  return { email: account.email, name: name.replace(/\b\w/g, (letter) => letter.toUpperCase()) }
}

export function getSessionUser() {
  const email = sessionStorage.getItem(SESSION_KEY)
  if (!email) return null
  const account = getAccounts()[email]
  return account ? toUser(account) : null
}

export async function registerAccount(email, password) {
  const normalizedEmail = email.trim().toLowerCase()
  const accounts = getAccounts()
  if (accounts[normalizedEmail]) return { ok: false, error: 'An account with this email already exists.' }

  const salt = createSalt()
  accounts[normalizedEmail] = { email: normalizedEmail, salt, passwordHash: await hashPassword(password, salt) }
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts))
  sessionStorage.setItem(SESSION_KEY, normalizedEmail)
  return { ok: true, user: toUser(accounts[normalizedEmail]) }
}

export async function loginAccount(email, password) {
  const normalizedEmail = email.trim().toLowerCase()
  const account = getAccounts()[normalizedEmail]
  if (!account) return { ok: false, error: 'No account found for this email. Please register first.' }

  const passwordHash = await hashPassword(password, account.salt)
  if (passwordHash !== account.passwordHash) return { ok: false, error: 'Incorrect email or password.' }

  sessionStorage.setItem(SESSION_KEY, normalizedEmail)
  return { ok: true, user: toUser(account) }
}

export function clearSession() {
  sessionStorage.removeItem(SESSION_KEY)
}
