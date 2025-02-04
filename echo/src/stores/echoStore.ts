import type { FeedbackPayload, FullEchoConfig } from '~/types'
import { type Notification } from '~/types'
import { debounce } from '~/utils/debounce'
import { registerMutationObserver, registerWindowEventListener } from '~/utils/listeners'
import { clearPageState, getPageKey, getStoredPagesCount, loadPageState, savePageState } from '~/utils/storage'
import { type DrawingStore, createDrawingStore } from './drawingStore'
import { type FeedbackStore, createFeedbackStore } from './feedbackStore'
import { type WidgetStore, createWidgetStore } from './widgetStore'

export type EchoStore = {
	feedback: FeedbackStore
	drawing: DrawingStore
	widget: WidgetStore
	methods: {
		reset: () => void
		postSubmit: (result: Notification) => void
		onSubmit: (data: FeedbackPayload) => Promise<void>
	}
}

export const createEchoStore = (config: FullEchoConfig): EchoStore => {
	let currentPageKey = getPageKey()
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

	const feedback = createFeedbackStore(config, currentPageKey, (state, isClearing) => {
		debouncedSave(currentPageKey, isClearing)
	})

	const drawing = createDrawingStore(config, currentPageKey, (state, isClearing) => {
		debouncedSave(currentPageKey, isClearing)
	})

	const widget = createWidgetStore(config, currentPageKey)

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
		methods: {
			reset,
			postSubmit: (result: Notification) => {
				reset()
				widget.setState({ notification: { show: true, type: result.type, message: result.message } })

				setTimeout(() => {
					widget.setState({ notification: { show: false, type: result.type, message: result.message } })
				}, 5000)
			},
			onSubmit: (data: FeedbackPayload) => {
				return config.onSubmit(data)
			},
		},
	}
}
