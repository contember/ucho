import { createSignal } from 'solid-js'
import { DrawingTool, Point, Shape } from '../types'

export interface DrawingState {
	isSelecting: () => boolean
	setIsSelecting: (value: boolean) => void
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
}

export const useDrawingState = (): DrawingState => {
	const [isSelecting, setIsSelecting] = createSignal(false)
	const [isDrawing, setIsDrawing] = createSignal(false)
	const [currentPoints, setCurrentPoints] = createSignal<Point[]>([])
	const [shapes, setShapes] = createSignal<Shape[]>([])
	const [currentPath, setCurrentPath] = createSignal<string>('')
	const [selectedShapeId, setSelectedShapeId] = createSignal<string | null>(null)
	const [selectedTool, setSelectedTool] = createSignal<DrawingTool>('highlight')

	return {
		isSelecting,
		setIsSelecting,
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
	}
}
