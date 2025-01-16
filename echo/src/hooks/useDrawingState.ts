import { createSignal } from 'solid-js'
import { Point } from '../types'

export interface DrawingState {
	isSelecting: () => boolean
	setIsSelecting: (value: boolean) => void
	isDrawing: () => boolean
	setIsDrawing: (value: boolean) => void
	startPoint: () => Point | null
	setStartPoint: (value: Point | null) => void
	endPoint: () => Point | null
	setEndPoint: (value: Point | null) => void
	drawingPoints: () => Point[]
	setDrawingPoints: (value: Point[]) => void
	paths: () => string[]
	setPaths: (value: string[]) => void
	currentPath: () => string
	setCurrentPath: (value: string | ((prev: string) => string)) => void
}

export const useDrawingState = (): DrawingState => {
	const [isSelecting, setIsSelecting] = createSignal(false)
	const [isDrawing, setIsDrawing] = createSignal(false)
	const [startPoint, setStartPoint] = createSignal<Point | null>(null)
	const [endPoint, setEndPoint] = createSignal<Point | null>(null)
	const [drawingPoints, setDrawingPoints] = createSignal<Point[]>([])
	const [paths, setPaths] = createSignal<string[]>([])
	const [currentPath, setCurrentPath] = createSignal<string>('')

	return {
		isSelecting,
		setIsSelecting,
		isDrawing,
		setIsDrawing,
		startPoint,
		setStartPoint,
		endPoint,
		setEndPoint,
		drawingPoints,
		setDrawingPoints,
		paths,
		setPaths,
		currentPath,
		setCurrentPath,
	}
}
