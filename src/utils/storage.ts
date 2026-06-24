export const STORAGE_KEYS = {
  pets: 'pet-health-pets',
  weights: 'pet-health-weights',
  vaccines: 'pet-health-vaccines',
  logs: 'pet-health-logs',
  initialized: 'pet-health-initialized',
}

export function getFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function setToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    console.error('Failed to save to localStorage:', e)
  }
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}
