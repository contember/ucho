import { createEffect, onCleanup } from 'solid-js'
import { createStore } from 'solid-js/store'
import { DrawingTool, FeedbackData, Notification, Point, Screenshot, Shape, TextConfig } from '~/types'
import { debounce } from '~/utils/debounce'
import { clearPageState, getPageKey, loadPageState, savePageState } from '~/utils/storage'

export interface FeedbackState {
	comment: string
	screenshot?: Screenshot
	isCapturing: boolean
	isMinimized: boolean
}

export interface DrawingState {
	isDrawing: boolean
	selectedShapeId: string | null
	selectedTool: DrawingTool
	selectedColor: string
	shapes: Shape[]
	currentPoints: Point[]
	currentPath: string
	showTooltip: boolean
	mousePosition: Point
	hasDrawn: boolean
	// Drag state
	isDragging: boolean
	dragStartPos: Point | null
	initialClickPos: Point | null
	dragOffset: Point | null
}

export interface WidgetState {
	isOpen: boolean
	primaryColor: string
	onSubmit: (data: FeedbackData) => void | Promise<void>
	notification: Notification
	dimensions: {
		width: number
		height: number
	}
}

interface EchoStoreConfig {
	primaryColor: string
	onSubmit: (data: FeedbackData) => Promise<void>
	text: TextConfig
}

export interface EchoStore {
	feedback: FeedbackState
	setFeedback: (state: Partial<FeedbackState>) => void
	drawing: DrawingState
	setDrawing: (state: Partial<DrawingState>) => void
	widget: WidgetState
	setWidget: (state: Partial<WidgetState>) => void
	text: TextConfig
	methods: {
		reset: () => void
		postSubmit: (result: Notification) => void
	}
}

export const createEchoStore = (config: EchoStoreConfig): EchoStore => {
	let currentPageKey = getPageKey()
	const savedState = loadPageState(currentPageKey)

	const [feedback, setFeedback] = createStore<FeedbackState>({
		comment: savedState?.feedback.comment || '',
		screenshot: undefined,
		isCapturing: false,
		isMinimized: false,
	})

	const [drawing, setDrawing] = createStore<DrawingState>({
		isDrawing: false,
		currentPoints: [],
		shapes: savedState?.drawing.shapes || [],
		currentPath: '',
		selectedShapeId: null,
		selectedTool: 'highlight',
		showTooltip: true,
		mousePosition: { x: 0, y: 0 },
		hasDrawn: savedState?.drawing.hasDrawn || false,
		selectedColor: config.primaryColor,
		isDragging: false,
		dragStartPos: null,
		initialClickPos: null,
		dragOffset: null,
	})

	const [widget, setWidget] = createStore<WidgetState>({
		isOpen: false,
		primaryColor: config.primaryColor,
		onSubmit: config.onSubmit,
		notification: {
			show: false,
			type: null,
			message: null,
		},
		dimensions: {
			width: document.documentElement.clientWidth,
			height: document.documentElement.scrollHeight,
		},
	})

	const [text] = createStore<TextConfig>(config.text)

	// Check if state should be saved
	const shouldSaveState = () => {
		return feedback.comment.trim().length > 0 || drawing.shapes.length > 0
	}

	// Debounced save function
	const debouncedSave = debounce((pageKey: string) => {
		if (shouldSaveState()) {
			savePageState(pageKey, { feedback, drawing })
		}
	}, 1000)

	// Handle URL changes
	const handleUrlChange = () => {
		const newPageKey = getPageKey()
		if (newPageKey !== currentPageKey) {
			// Save current state before switching only if there's content
			if (shouldSaveState()) {
				savePageState(currentPageKey, { feedback, drawing })
			}

			// Load new state
			currentPageKey = newPageKey
			const newState = loadPageState(currentPageKey)

			setFeedback({
				...feedback,
				comment: newState?.feedback.comment || '',
			})

			setDrawing({
				...drawing,
				shapes: newState?.drawing.shapes || [],
				hasDrawn: newState?.drawing.hasDrawn || false,
			})
		}
	}

	// Listen for URL changes
	createEffect(() => {
		// Listen for history changes (pushState/replaceState)
		const originalPushState = history.pushState
		const originalReplaceState = history.replaceState

		history.pushState = function (...args) {
			originalPushState.apply(this, args)
			handleUrlChange()
		}

		history.replaceState = function (...args) {
			originalReplaceState.apply(this, args)
			handleUrlChange()
		}

		// Listen for popstate (back/forward buttons)
		window.addEventListener('popstate', handleUrlChange)

		// Listen for navigation events
		const observer = new MutationObserver(() => {
			handleUrlChange()
		})
		observer.observe(document.documentElement, {
			childList: true,
			subtree: true,
		})

		onCleanup(() => {
			history.pushState = originalPushState
			history.replaceState = originalReplaceState
			window.removeEventListener('popstate', handleUrlChange)
			observer.disconnect()
		})
	})

	const wrappedSetFeedback = (state: Partial<FeedbackState>) => {
		setFeedback(state)
		debouncedSave(currentPageKey)
	}

	const wrappedSetDrawing = (state: Partial<DrawingState>) => {
		setDrawing(state)
		if (shouldSaveState()) {
			savePageState(currentPageKey, { feedback, drawing })
		}
	}

	const reset = () => {
		clearPageState(currentPageKey)

		setFeedback({
			comment: '',
			screenshot: undefined,
			isCapturing: false,
			isMinimized: false,
		})

		setDrawing({
			isDrawing: false,
			currentPoints: [],
			shapes: [],
			currentPath: '',
			selectedShapeId: null,
			selectedTool: 'highlight',
			showTooltip: true,
			mousePosition: { x: 0, y: 0 },
			hasDrawn: false,
			selectedColor: config.primaryColor,
			isDragging: false,
			dragStartPos: null,
			initialClickPos: null,
			dragOffset: null,
		})

		setWidget({
			...widget,
			isOpen: false,
		})
	}

	const postSubmit = (result: Notification) => {
		if (result.type === 'success') reset()
		else if (result.type === 'error') setWidget({ isOpen: false })

		setWidget({ notification: { show: true, type: result.type, message: result.message } })

		setTimeout(() => {
			setWidget({ notification: { show: false, type: result.type, message: result.message } })
		}, 5000)
	}

	return {
		feedback,
		setFeedback: wrappedSetFeedback,
		drawing,
		setDrawing: wrappedSetDrawing,
		widget,
		setWidget,
		text,
		methods: {
			reset,
			postSubmit,
		},
	}
}
