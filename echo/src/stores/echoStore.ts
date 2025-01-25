import { createStore } from 'solid-js/store'
import { DrawingTool, FeedbackData, Notification, Point, Screenshot, Shape, TextConfig } from '~/types'

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
		selectedColor: config.primaryColor,
		// Initialize drag state
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
	})

	const [text] = createStore<TextConfig>(config.text)

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
			selectedColor: config.primaryColor,
			// Reset drag state
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
		setFeedback,
		drawing,
		setDrawing,
		widget,
		setWidget,
		text,
		methods: {
			reset,
			postSubmit,
		},
	}
}
