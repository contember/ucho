const STORAGE_PREFIX = 'echo_'

export const getStorageKey = (key: string): string => `${STORAGE_PREFIX}${key}`

export const getFromStorage = <T>(key: string, defaultValue: T): T => {
	try {
		const item = localStorage.getItem(getStorageKey(key))
		return item ? JSON.parse(item) : defaultValue
	} catch {
		return defaultValue
	}
}

export const setToStorage = <T>(key: string, value: T): void => {
	try {
		localStorage.setItem(getStorageKey(key), JSON.stringify(value))
	} catch (error) {
		console.warn('Failed to save to localStorage:', error)
	}
}
