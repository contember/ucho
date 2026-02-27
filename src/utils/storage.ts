import { DrawingState, FeedbackState } from '~/stores'
import type { CustomInputValue, Shape } from '~/types'

type StoredPageState = {
	feedback: {
		message: string
		customInputValues?: Record<string, CustomInputValue>
	}
	drawing: {
		shapes: Shape[]
	}
	latestQuery?: string
}

const STORAGE_PREFIX = 'ucho_'
const PAGES_KEY = 'ucho-pages'

export const formatPagePath = (path: string | undefined): string => {
	if (!path || path === '/') return '/'
	const parts = path.split('/')
	return parts.length <= 4 ? path : `/${parts[1]}/.../${parts[parts.length - 1]}`
}

export const dispatchStorageChange = () => {
	window.dispatchEvent(new Event('ucho-storage-change'))
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
	const pathname = window.location.pathname || '/'
	const search = window.location.search
	return `${pathname}${search}`
}

export const savePageState = (pageKey: string, state: { feedback: FeedbackState; drawing: DrawingState }) => {
	try {
		if (!state.feedback.hasUserInteracted && state.drawing.shapes.length < 1) return

		const feedbackToSave = {
			message: state.feedback.message,
			customInputValues: state.feedback.customInputValues,
		}

		const pages = getFromStorage<Record<string, StoredPageState>>(PAGES_KEY, {})

		const hasContent = feedbackToSave.message.trim().length > 0
			|| Object.values(feedbackToSave.customInputValues ?? {}).some(v => Array.isArray(v) ? v.length > 0 : v !== '')
			|| state.drawing.shapes.length > 0

		if (hasContent) {
			pages[pageKey] = {
				...(pages[pageKey] || {}),
				feedback: feedbackToSave,
				drawing: {
					shapes: state.drawing.shapes,
				},
			}
		} else {
			delete pages[pageKey]
		}

		setToStorage(PAGES_KEY, pages)
		dispatchStorageChange()
	} catch (error) {
		console.warn('Failed to save page state:', error)
	}
}

export const loadPageState = (pageKey: string): StoredPageState | undefined => {
	try {
		return getFromStorage<Record<string, StoredPageState>>(PAGES_KEY, {})[pageKey]
	} catch (error) {
		console.error('Failed to load page state:', error)
		return undefined
	}
}

export const clearPageState = (pageKey: string) => {
	try {
		const allPagesData = getFromStorage<Record<string, StoredPageState>>(PAGES_KEY, {})
		delete allPagesData[pageKey]
		setToStorage(PAGES_KEY, allPagesData)
		dispatchStorageChange()
	} catch (error) {
		console.error('Failed to clear page state:', error)
	}
}

export const getStoredPagesCount = () => {
	try {
		const data = getFromStorage<Record<string, StoredPageState>>(PAGES_KEY, {})
		return Object.keys(data).length
	} catch (error) {
		console.error('Failed to get stored pages count:', error)
		return 0
	}
}

export const getStoredPages = () => {
	try {
		const allPagesData = getFromStorage<Record<string, StoredPageState>>(PAGES_KEY, {})
		return Object.entries(allPagesData).map(([path, state]) => ({
			path: formatPagePath(path),
			state,
		}))
	} catch (error) {
		console.error('Failed to get stored pages:', error)
		return []
	}
}
