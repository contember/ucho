import { afterEach, beforeEach, describe, expect, test } from 'bun:test'
import { clearPageState, formatPagePath, getStorageKey, loadPageState, savePageState } from '~/utils/storage'

// Mock localStorage
const createMockLocalStorage = () => {
	const store: Record<string, string> = {}
	return {
		getItem: (key: string) => store[key] ?? null,
		setItem: (key: string, value: string) => {
			store[key] = value
		},
		removeItem: (key: string) => {
			delete store[key]
		},
		clear: () => {
			for (const key in store) delete store[key]
		},
		get length() {
			return Object.keys(store).length
		},
		key: (index: number) => Object.keys(store)[index] ?? null,
	}
}

beforeEach(() => {
	globalThis.localStorage = createMockLocalStorage() as any
	globalThis.window = { dispatchEvent: () => true } as any
})

afterEach(() => {
	delete (globalThis as any).localStorage
	delete (globalThis as any).window
})

describe('formatPagePath', () => {
	test('root path', () => {
		expect(formatPagePath('/')).toBe('/')
	})

	test('undefined path', () => {
		expect(formatPagePath(undefined)).toBe('/')
	})

	test('short path passes through', () => {
		expect(formatPagePath('/foo/bar')).toBe('/foo/bar')
	})

	test('3-segment path passes through', () => {
		expect(formatPagePath('/a/b/c')).toBe('/a/b/c')
	})

	test('long path gets truncated with ...', () => {
		expect(formatPagePath('/a/b/c/d')).toBe('/a/.../d')
	})
})

describe('getStorageKey', () => {
	test('prepends ucho_ prefix', () => {
		expect(getStorageKey('test')).toBe('ucho_test')
	})
})

describe('savePageState', () => {
	test('skips save when no user interaction and no shapes', () => {
		savePageState('/test', {
			feedback: { message: '', isCapturing: false, isMinimized: false, customInputValues: {}, hasUserInteracted: false },
			drawing: {
				shapes: [],
				isDrawing: false,
				selectedShapeId: null,
				selectedTool: 'rectangle',
				selectedColor: '#FF0000',
				currentPoints: [],
				showTooltip: false,
				mousePosition: { x: 0, y: 0 },
				hasDrawn: false,
				isDragging: false,
			},
		} as any)
		expect(localStorage.getItem('ucho_ucho-pages')).toBeNull()
	})

	test('saves when message has content', () => {
		savePageState('/test', {
			feedback: { message: 'Bug report', isCapturing: false, isMinimized: false, customInputValues: {}, hasUserInteracted: true },
			drawing: {
				shapes: [],
				isDrawing: false,
				selectedShapeId: null,
				selectedTool: 'rectangle',
				selectedColor: '#FF0000',
				currentPoints: [],
				showTooltip: false,
				mousePosition: { x: 0, y: 0 },
				hasDrawn: false,
				isDragging: false,
			},
		} as any)
		const stored = JSON.parse(localStorage.getItem('ucho_ucho-pages')!)
		expect(stored['/test'].feedback.message).toBe('Bug report')
	})

	test('deletes page entry when content is cleared', () => {
		// First save something
		savePageState('/test', {
			feedback: { message: 'Bug report', isCapturing: false, isMinimized: false, customInputValues: {}, hasUserInteracted: true },
			drawing: {
				shapes: [],
				isDrawing: false,
				selectedShapeId: null,
				selectedTool: 'rectangle',
				selectedColor: '#FF0000',
				currentPoints: [],
				showTooltip: false,
				mousePosition: { x: 0, y: 0 },
				hasDrawn: false,
				isDragging: false,
			},
		} as any)
		// Then clear it
		savePageState('/test', {
			feedback: { message: '', isCapturing: false, isMinimized: false, customInputValues: {}, hasUserInteracted: true },
			drawing: {
				shapes: [],
				isDrawing: false,
				selectedShapeId: null,
				selectedTool: 'rectangle',
				selectedColor: '#FF0000',
				currentPoints: [],
				showTooltip: false,
				mousePosition: { x: 0, y: 0 },
				hasDrawn: false,
				isDragging: false,
			},
		} as any)
		const stored = JSON.parse(localStorage.getItem('ucho_ucho-pages')!)
		expect(stored['/test']).toBeUndefined()
	})
})

describe('loadPageState / clearPageState round-trip', () => {
	test('loads previously saved state', () => {
		savePageState('/page', {
			feedback: { message: 'Hello', isCapturing: false, isMinimized: false, customInputValues: {}, hasUserInteracted: true },
			drawing: {
				shapes: [],
				isDrawing: false,
				selectedShapeId: null,
				selectedTool: 'rectangle',
				selectedColor: '#FF0000',
				currentPoints: [],
				showTooltip: false,
				mousePosition: { x: 0, y: 0 },
				hasDrawn: false,
				isDragging: false,
			},
		} as any)
		const loaded = loadPageState('/page')
		expect(loaded?.feedback.message).toBe('Hello')
	})

	test('returns undefined for non-existent page', () => {
		expect(loadPageState('/nonexistent')).toBeUndefined()
	})

	test('clearPageState removes saved state', () => {
		savePageState('/page', {
			feedback: { message: 'Hello', isCapturing: false, isMinimized: false, customInputValues: {}, hasUserInteracted: true },
			drawing: {
				shapes: [],
				isDrawing: false,
				selectedShapeId: null,
				selectedTool: 'rectangle',
				selectedColor: '#FF0000',
				currentPoints: [],
				showTooltip: false,
				mousePosition: { x: 0, y: 0 },
				hasDrawn: false,
				isDragging: false,
			},
		} as any)
		clearPageState('/page')
		expect(loadPageState('/page')).toBeUndefined()
	})
})
