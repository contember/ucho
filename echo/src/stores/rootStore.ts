import { createStore } from 'solid-js/store'
import { DrawingTool, FeedbackData, Point, Screenshot, Shape } from '../types'
import { getFromStorage, setToStorage } from '../utils/storage'

export interface FeedbackState {
	comment: string
	screenshot?: Screenshot
	isCapturing: boolean
	isMinimized: boolean
}

export interface DrawingState {
	isDrawing: boolean
	currentPoints: Point[]
	shapes: Shape[]
	currentPath: string
	selectedShapeId: string | null
	selectedTool: DrawingTool
	showTooltip: boolean
	mousePosition: Point
	hasDrawn: boolean
}

export interface WidgetState {
	isOpen: boolean
	primaryColor: string
	onSubmit: (data: FeedbackData) => void | Promise<void>
}

export interface RootStore {
	feedback: FeedbackState
	setFeedback: (state: Partial<FeedbackState>) => void
	drawing: DrawingState
	setDrawing: (state: Partial<DrawingState>) => void
	widget: WidgetState
	setWidget: (state: Partial<WidgetState>) => void
	reset: () => void
}

export const createRootStore = (props: {
	primaryColor: string
	onSubmit: (data: FeedbackData) => void | Promise<void>
}): RootStore => {
	const [feedback, setFeedback] = createStore<FeedbackState>({
		comment: '',
		screenshot: undefined,
		isCapturing: false,
		isMinimized: false,
	})

	const [drawing, setDrawing] = createStore<DrawingState>({
		isDrawing: false,
		currentPoints: [],
		shapes: [],
		currentPath: '',
		selectedShapeId: null,
		selectedTool: 'highlight',
		showTooltip: true,
		mousePosition: { x: 0, y: 0 },
		hasDrawn: false,
	})

	const [widget, setWidget] = createStore<WidgetState>({
		isOpen: false,
		primaryColor: props.primaryColor,
		onSubmit: props.onSubmit,
	})

	const reset = () => {
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
		})

		setWidget({
			...widget,
			isOpen: false,
		})
	}

	return {
		feedback,
		setFeedback,
		drawing,
		setDrawing,
		widget,
		setWidget,
		reset,
	}
}
