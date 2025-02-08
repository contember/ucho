import type { DrawingTool, EchoConfig, FeedbackPayload, FullEchoConfig } from '~/types'
import { createNotificationManager } from '~/utils/notifications'
import { createDebouncedStateSaver } from '~/utils/stateManagement'
import { clearPageState, getPageKey, loadPageState } from '~/utils/storage'
import { type DrawingState, type DrawingStore, createDrawingStore } from './drawingStore'
import { type FeedbackState, type FeedbackStore, createFeedbackStore } from './feedbackStore'
import { type WidgetStore, createWidgetStore } from './widgetStore'

export type EchoStore = {
	feedback: FeedbackStore
	drawing: DrawingStore
	widget: WidgetStore
	methods: {
		reset: () => void
		submit: EchoConfig['onSubmit']
		handlePageChange: (newPageKey: string) => void
	}
}

export const createEchoStore = (config: FullEchoConfig): EchoStore => {
	let currentPageKey = getPageKey()

	const widget = createWidgetStore(config, currentPageKey)
	const debouncedSave = createDebouncedStateSaver(widget)
	const notifications = createNotificationManager(widget)

	const feedback = createFeedbackStore(config, currentPageKey, (state, isClearing) => {
		debouncedSave(
			currentPageKey,
			{
				feedback: state as FeedbackState,
				drawing: drawing.state,
			},
			isClearing,
		)
	})

	const drawing = createDrawingStore(config, currentPageKey, (state, isClearing) => {
		debouncedSave(
			currentPageKey,
			{
				feedback: feedback.state,
				drawing: state as DrawingState,
			},
			isClearing,
		)
	})

	const handlePageChange = (newPageKey: string) => {
		currentPageKey = newPageKey
		const newState = loadPageState(currentPageKey)

		feedback.setState({
			message: newState?.feedback.message || '',
			customInputValues: newState?.feedback.customInputValues || {},
		})

		drawing.setState({
			shapes: newState?.drawing.shapes || [],
		})
	}

	const reset = () => {
		clearPageState(currentPageKey)

		const initialState = {
			feedback: {
				message: '',
				screenshot: undefined,
				isCapturing: false,
				isMinimized: false,
				customInputValues: {},
			} as FeedbackState,
			drawing: {
				isDrawing: false,
				currentPoints: [],
				shapes: [],
				selectedShapeId: null,
				selectedTool: 'rectangle' as DrawingTool,
				selectedColor: config.primaryColor,
				showTooltip: true,
				mousePosition: { x: 0, y: 0 },
				hasDrawn: false,
				isDragging: false,
				dragStartPos: null,
				initialClickPos: null,
				dragOffset: null,
				cursor: drawing.state.cursor,
			} as DrawingState,
			widget: {
				isOpen: false,
			},
		}

		feedback.setState(initialState.feedback, true)
		drawing.setState(initialState.drawing, true)
		widget.setState(initialState.widget)
	}

	return {
		feedback,
		drawing,
		widget,
		methods: {
			reset,
			handlePageChange,
			submit: async (data: FeedbackPayload) => {
				widget.setState({ isOpen: false })

				try {
					const response = await config.onSubmit(data)

					if (response instanceof Response && !response.ok) {
						notifications.show({ type: 'error', message: 'Submission failed' })
						return response
					}

					reset()
					notifications.show({ type: 'success', message: 'Feedback submitted' })
					return response
				} catch (error) {
					notifications.show({ type: 'error', message: 'Submission failed' })
				}
			},
		},
	}
}
