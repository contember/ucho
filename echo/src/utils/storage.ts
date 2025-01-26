import { DrawingState, FeedbackState } from '~/stores/echoStore'
import { Shape } from '~/types'

interface StoredPageState {
	feedback: {
		comment: string
	}
	drawing: {
		shapes: Shape[]
		hasDrawn: boolean
	}
}

const STORAGE_PREFIX = 'echo_'
const STORAGE_KEY = 'echo_page_state'

export const dispatchStorageChange = () => {
	window.dispatchEvent(new CustomEvent('echo-storage-change'))
}

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

export const getPageKey = () => {
	return window.location.pathname
}

export const savePageState = (pageKey: string, state: { feedback: FeedbackState; drawing: DrawingState }) => {
	try {
		const existingData = localStorage.getItem(STORAGE_KEY)
		const allPagesData = existingData ? JSON.parse(existingData) : {}

		const essentialState: StoredPageState = {
			feedback: {
				comment: state.feedback.comment,
			},
			drawing: {
				shapes: state.drawing.shapes,
				hasDrawn: state.drawing.hasDrawn,
			},
		}

		allPagesData[pageKey] = essentialState
		localStorage.setItem(STORAGE_KEY, JSON.stringify(allPagesData))
		dispatchStorageChange()
	} catch (error) {
		console.error('Failed to save page state:', error)
	}
}

export const loadPageState = (pageKey: string): StoredPageState | null => {
	try {
		const existingData = localStorage.getItem(STORAGE_KEY)
		if (!existingData) return null

		const allPagesData = JSON.parse(existingData)
		return allPagesData[pageKey] || null
	} catch (error) {
		console.error('Failed to load page state:', error)
		return null
	}
}

export const clearPageState = (pageKey: string) => {
	try {
		const existingData = localStorage.getItem(STORAGE_KEY)
		if (!existingData) return

		const allPagesData = JSON.parse(existingData)
		delete allPagesData[pageKey]
		localStorage.setItem(STORAGE_KEY, JSON.stringify(allPagesData))
		dispatchStorageChange()
	} catch (error) {
		console.error('Failed to clear page state:', error)
	}
}

export const getStoredPagesCount = (): number => {
	try {
		const existingData = localStorage.getItem(STORAGE_KEY)
		if (!existingData) return 0

		const allPagesData = JSON.parse(existingData)
		return Object.keys(allPagesData).length
	} catch (error) {
		console.error('Failed to get stored pages count:', error)
		return 0
	}
}

let cachedPages: { path: string; state: StoredPageState }[] | null = null

export const getStoredPages = (): { path: string; state: StoredPageState }[] => {
	if (cachedPages !== null) return cachedPages

	try {
		const existingData = localStorage.getItem(STORAGE_KEY)
		if (!existingData) return []

		const allPagesData = JSON.parse(existingData)
		cachedPages = Object.entries(allPagesData).map(([path, state]) => ({
			path,
			state: state as StoredPageState,
		}))
		return cachedPages
	} catch (error) {
		console.error('Failed to get stored pages:', error)
		return []
	}
}

// Clear cache when storage changes
export const clearCache = () => {
	cachedPages = null
}
