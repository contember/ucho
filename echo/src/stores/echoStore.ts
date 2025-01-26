import { createEffect, onCleanup } from 'solid-js'
import { createStore } from 'solid-js/store'
import { DrawingTool, FeedbackData, Notification, Point, Screenshot, Shape, TextConfig } from '~/types'
import { debounce } from '~/utils/debounce'
import { clearPageState, getPageKey, getStoredPagesCount, loadPageState, savePageState } from '~/utils/storage'

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
	isPagesDropdownOpen: boolean
	pagesCount: number
}

interface EchoStoreConfig {
	primaryColor: string
	onSubmit: (data: FeedbackData) => Promise<void>
	text: TextConfig
}

export interface EchoStore {
	feedback: FeedbackState
	setFeedback: (state: Partial<FeedbackState>, isClearing?: boolean) => void
	drawing: DrawingState
	setDrawing: (state: Partial<DrawingState>, isClearing?: boolean) => void
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
		shapes: savedState?.drawing.shapes || [],
		hasDrawn: false,
		isDrawing: false,
		currentPoints: [],
		currentPath: '',
		selectedShapeId: null,
		selectedTool: 'highlight',
		showTooltip: true,
		mousePosition: { x: 0, y: 0 },
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
		isPagesDropdownOpen: false,
		pagesCount: getStoredPagesCount(),
	})

	const [text] = createStore<TextConfig>(config.text)

	const shouldSaveState = (isClearing = false) => {
		return isClearing || feedback.comment.trim().length > 0 || drawing.shapes.length > 0
	}

	const shouldTriggerSave = (state: Partial<FeedbackState | DrawingState>) => {
		if ('comment' in state) return true
		if ('shapes' in state) return true
		if ('isClearing' in state) return true

		return false
	}

	const debouncedSave = debounce((pageKey: string, isClearing = false) => {
		if (shouldSaveState(isClearing)) {
			savePageState(pageKey, { feedback, drawing })
			setWidget({ pagesCount: getStoredPagesCount() })
		}
	}, 1000)

	const handleUrlChange = () => {
		const newPageKey = getPageKey()
		if (newPageKey !== currentPageKey) {
			currentPageKey = newPageKey
			const newState = loadPageState(currentPageKey)

			setFeedback({
				...feedback,
				comment: newState?.feedback.comment || '',
			})

			setDrawing({
				...drawing,
				shapes: newState?.drawing.shapes || [],
			})
		}
	}

	createEffect(() => {
		const observer = new MutationObserver(() => {
			const newPageKey = getPageKey()
			if (newPageKey !== currentPageKey) {
				handleUrlChange()
			}
		})

		observer.observe(document.documentElement, {
			subtree: true,
			childList: true,
		})

		window.addEventListener('popstate', handleUrlChange)

		onCleanup(() => {
			observer.disconnect()
			window.removeEventListener('popstate', handleUrlChange)
		})
	})

	const wrappedSetFeedback = (state: Partial<FeedbackState>, isClearing = false) => {
		setFeedback(state)
		if (shouldTriggerSave(state) || isClearing) {
			debouncedSave(currentPageKey, isClearing)
		}
	}

	const wrappedSetDrawing = (state: Partial<DrawingState>, isClearing = false) => {
		setDrawing(state)
		if (shouldTriggerSave(state) || isClearing) {
			debouncedSave(currentPageKey, isClearing)
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
