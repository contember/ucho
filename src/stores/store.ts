import type { Config, DrawingTool, FullConfig } from '~/types'
import { createNotificationManager } from '~/utils/notifications'
import { createDebouncedStateSaver } from '~/utils/state-management'
import { clearPageState, getPageKey, loadPageState } from '~/utils/storage'
import { createDrawingStore, type DrawingStore } from './drawing-store'
import { createFeedbackStore, type FeedbackStore, getDefaultCustomValues } from './feedback-store'
import { createWidgetStore, type WidgetStore } from './widget-store'

export type Store = {
	feedback: FeedbackStore
	drawing: DrawingStore
	widget: WidgetStore
	methods: {
		reset: () => void
		submit: Config['onSubmit']
		handlePageChange: (newPageKey: string) => void
	}
}

export const createStore = (config: FullConfig): Store => {
	let currentPageKey = getPageKey()

	const widget = createWidgetStore(config, currentPageKey)
	const debouncedSave = createDebouncedStateSaver(widget)
	const notifications = createNotificationManager(widget)

	const feedback = createFeedbackStore(
		config,
		currentPageKey,
		(state, isClearing) => {
			debouncedSave(
				currentPageKey,
				{
					feedback: { ...feedback.state, ...state },
					drawing: drawing.state,
				},
				isClearing,
			)
		},
		config.customInputs,
	)

	const drawing = createDrawingStore(config, currentPageKey, (state, isClearing) => {
		debouncedSave(
			currentPageKey,
			{
				feedback: feedback.state,
				drawing: { ...drawing.state, ...state },
			},
			isClearing,
		)
	})

	const handlePageChange = (newPageKey: string) => {
		currentPageKey = newPageKey
		const newState = loadPageState(currentPageKey)

		const customInputValues = {
			...getDefaultCustomValues(widget.state.customInputs),
			...newState?.feedback.customInputValues,
		}

		feedback.setState({
			message: newState?.feedback.message || '',
			customInputValues,
			hasUserInteracted: false,
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
				hasUserInteracted: false,
				customInputValues: getDefaultCustomValues(widget.state.customInputs),
			},
			drawing: {
				isDrawing: false,
				isResizing: false,
				resizeAnchor: null,
				currentPoints: [],
				shapes: [],
				selectedShapeId: null,
				selectedTool: 'rectangle' as DrawingTool,
				selectedColor: widget.state.primaryColor,
				showTooltip: true,
				mousePosition: { x: 0, y: 0 },
				hasDrawn: false,
				isDragging: false,
				dragStartPos: null,
				initialClickPos: null,
				dragOffset: null,
				cursor: drawing.state.cursor,
			},
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
			submit: async data => {
				try {
					const response = await config.onSubmit(data)

					if (response instanceof Response && !response.ok) {
						notifications.show({ type: 'error', message: 'Submission failed' })
						return response
					}

					widget.setState({ isOpen: false })
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
