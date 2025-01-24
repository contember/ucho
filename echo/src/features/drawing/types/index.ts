import { Point, Shape } from '~/types'

export interface DrawingState {
	isDrawing: boolean
	currentPoints: Point[]
	currentPath: string
	selectedShapeId: string | null
	mousePosition: Point | null
	showTooltip: boolean
	hasDrawn: boolean
	selectedTool: string
	selectedColor: string
	shapes: Shape[]
	// Drag state
	isDragging: boolean
	dragStartPos: Point | null
	initialClickPos: Point | null
	dragOffset: Point | null
}

export interface ViewportState {
	width: number
	height: number
}
