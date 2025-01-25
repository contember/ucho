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

const STORAGE_KEY = 'echo_page_state'

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
	} catch (error) {
		console.error('Failed to clear page state:', error)
	}
}
