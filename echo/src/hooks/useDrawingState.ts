import { createSignal } from 'solid-js'
import { DrawingTool, Point, Shape } from '../types'

export interface DrawingState {
	isDrawing: () => boolean
	setIsDrawing: (value: boolean) => void
	currentPoints: () => Point[]
	setCurrentPoints: (value: Point[]) => void
	currentPath: () => string
	setCurrentPath: (value: string | ((prev: string) => string)) => void
	shapes: () => Shape[]
	setShapes: (value: Shape[]) => void
	selectedShapeId: () => string | null
	setSelectedShapeId: (value: string | null) => void
	selectedTool: () => DrawingTool
	setSelectedTool: (value: DrawingTool) => void
	showTooltip: () => boolean
	setShowTooltip: (value: boolean) => void
	mousePosition: () => Point
	setMousePosition: (value: Point) => void
	hasDrawn: () => boolean
	setHasDrawn: (value: boolean) => void
}

export const useDrawingState = (): DrawingState => {
	const [isDrawing, setIsDrawing] = createSignal(false)
	const [currentPoints, setCurrentPoints] = createSignal<Point[]>([])
	const [shapes, setShapes] = createSignal<Shape[]>([])
	const [currentPath, setCurrentPath] = createSignal<string>('')
	const [selectedShapeId, setSelectedShapeId] = createSignal<string | null>(null)
	const [selectedTool, setSelectedTool] = createSignal<DrawingTool>('highlight')
	const [showTooltip, setShowTooltip] = createSignal(true)
	const [mousePosition, setMousePosition] = createSignal<Point>({ x: 0, y: 0 })
	const [hasDrawn, setHasDrawn] = createSignal(false)

	return {
		isDrawing,
		setIsDrawing,
		currentPoints,
		setCurrentPoints,
		shapes,
		setShapes,
		currentPath,
		setCurrentPath,
		selectedShapeId,
		setSelectedShapeId,
		selectedTool,
		setSelectedTool,
		showTooltip,
		setShowTooltip,
		mousePosition,
		setMousePosition,
		hasDrawn,
		setHasDrawn,
	}
}
