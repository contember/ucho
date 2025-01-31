import type { FullEchoOptions, TextConfig } from '~/types'
import { debounce } from '~/utils/debounce'
import { registerMutationObserver, registerWindowEventListener } from '~/utils/listener'
import { clearPageState, getPageKey, getStoredPagesCount, loadPageState, savePageState } from '~/utils/storage'
import { type DrawingStore, createDrawingStore } from './drawingStore'
import { type FeedbackStore, createFeedbackStore } from './feedbackStore'
import { type WidgetStore, createWidgetStore } from './widgetStore'

export interface EchoStore {
	feedback: FeedbackStore
	drawing: DrawingStore
	widget: WidgetStore
	text: TextConfig
	methods: {
		reset: () => void
	}
}

export const createEchoStore = (config: FullEchoOptions): EchoStore => {
	let currentPageKey = getPageKey()
	const savedState = loadPageState(currentPageKey)

	const debouncedSave = debounce((pageKey: string, isClearing = false) => {
		const shouldSaveState = isClearing || feedback.state.comment.trim().length > 0 || drawing.state.shapes.length > 0
		if (shouldSaveState) {
			savePageState(pageKey, {
				feedback: feedback.state,
				drawing: drawing.state,
			})
			widget.setState({ pagesCount: getStoredPagesCount() })
		}
	}, 1000)

	const feedback = createFeedbackStore(savedState?.feedback.comment || '', (state, isClearing) => {
		debouncedSave(currentPageKey, isClearing)
	})

	const drawing = createDrawingStore(config.primaryColor, (state, isClearing) => {
		debouncedSave(currentPageKey, isClearing)
	})

	const widget = createWidgetStore(config.primaryColor, config.onSubmit)

	const handleUrlChange = () => {
		const newPageKey = getPageKey()
		if (newPageKey !== currentPageKey) {
			currentPageKey = newPageKey
			const newState = loadPageState(currentPageKey)

			feedback.setState({
				comment: newState?.feedback.comment || '',
			})

			drawing.setState({
				shapes: newState?.drawing.shapes || [],
			})
		}
	}

	registerWindowEventListener({
		event: 'popstate',
		callback: handleUrlChange,
	})

	registerMutationObserver({
		target: document.documentElement,
		options: {
			childList: true,
			subtree: true,
		},
		callback: () => {
			const newPageKey = getPageKey()
			if (newPageKey !== currentPageKey) {
				handleUrlChange()
			}
		},
	})

	const reset = () => {
		clearPageState(currentPageKey)

		feedback.setState(
			{
				comment: '',
				screenshot: undefined,
				isCapturing: false,
				isMinimized: false,
			},
			true,
		)

		drawing.setState(
			{
				isDrawing: false,
				currentPoints: [],
				shapes: [],
				currentPath: '',
				selectedShapeId: null,
				selectedTool: 'rectangle',
				showTooltip: true,
				mousePosition: { x: 0, y: 0 },
				hasDrawn: false,
				selectedColor: config.primaryColor,
				isDragging: false,
				dragStartPos: null,
				initialClickPos: null,
				dragOffset: null,
			},
			true,
		)

		widget.setState({
			isOpen: false,
		})
	}

	return {
		feedback,
		drawing,
		widget,
		text: config.textConfig,
		methods: {
			reset,
		},
	}
}
