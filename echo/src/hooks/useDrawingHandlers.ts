import { config } from '../config'
import { Screenshot, Shape, ShapeType } from '../types'
import { DrawingState } from './useDrawingState'

interface UseDrawingHandlersProps extends DrawingState {
	primaryColor: string
	setScreenshot: (screenshot: Screenshot) => void
	setIsCapturing: (value: boolean) => void
}

export const useDrawingHandlers = ({
	isDrawing,
	setIsDrawing,
	currentPoints,
	setCurrentPoints,
	shapes,
	setShapes,
	setCurrentPath,
	selectedShapeId,
	setSelectedShapeId,
	selectedTool,
	primaryColor,
}: UseDrawingHandlersProps) => {
	const generateId = () => Math.random().toString(36).substring(2, 15)

	const getMousePosition = (e: MouseEvent) => {
		return {
			x: e.clientX,
			y: e.clientY,
		}
	}

	const getDistance = (p1: { x: number; y: number }, p2: { x: number; y: number }) => {
		const dx = p2.x - p1.x
		const dy = p2.y - p1.y
		return Math.sqrt(dx * dx + dy * dy)
	}

	const handleMouseDown = (e: MouseEvent) => {
		if (e.button === 2) {
			// Right click
			if (selectedShapeId()) {
				setShapes(shapes().filter(shape => shape.id !== selectedShapeId()))
				setSelectedShapeId(null)
			}
			return
		}

		const point = getMousePosition(e)
		setIsDrawing(true)
		setCurrentPoints([point])

		if (selectedTool() === 'highlight') {
			// For rectangle, we just need the start point
			setCurrentPoints([point])
		} else {
			// For pen strokes, we start the path
			setCurrentPath(`M ${point.x} ${point.y}`)
		}
	}

	const handleMouseMove = (e: MouseEvent) => {
		if (!isDrawing()) return

		const point = getMousePosition(e)

		if (selectedTool() === 'highlight') {
			// For rectangle, we just update the end point
			setCurrentPoints([currentPoints()[0], point])
		} else {
			const lastPoint = currentPoints()[currentPoints().length - 1]
			const distance = getDistance(lastPoint, point)
			const hysteresis = config.pen.hysteresis ?? 0

			// Always update the current path for smooth preview
			setCurrentPath((prev: string) => `${prev} L ${point.x} ${point.y}`)

			// Only add points that are far enough from the last point
			if (distance >= hysteresis) {
				setCurrentPoints([...currentPoints(), point])
			}
		}
	}

	const handleMouseUp = async () => {
		if (currentPoints().length < 2) {
			setIsDrawing(false)
			setCurrentPoints([])
			setCurrentPath('')
			return
		}

		const newShape: Shape = {
			id: generateId(),
			type: selectedTool() === 'highlight' ? 'rectangle' : 'path',
			color: primaryColor,
			points: currentPoints(),
		}

		setShapes([...shapes(), newShape])
		setIsDrawing(false)
		setCurrentPoints([])
		setCurrentPath('')
	}

	const handleShapeClick = (shapeId: string) => {
		setSelectedShapeId(selectedShapeId() === shapeId ? null : shapeId)
	}

	return {
		handleMouseDown,
		handleMouseMove,
		handleMouseUp,
		handleShapeClick,
	}
}
