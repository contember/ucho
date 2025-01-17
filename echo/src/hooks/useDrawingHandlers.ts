import { Screenshot, Shape, ShapeType } from '../types'
import { DrawingState } from './useDrawingState'

interface UseDrawingHandlersProps extends DrawingState {
	primaryColor: string
	setScreenshot: (screenshot: Screenshot) => void
	setIsCapturing: (value: boolean) => void
}

export const useDrawingHandlers = ({
	isSelecting,
	setIsSelecting,
	isDrawing,
	setIsDrawing,
	currentPoints,
	setCurrentPoints,
	shapes,
	setShapes,
	setCurrentPath,
	selectedShapeId,
	setSelectedShapeId,
	primaryColor,
}: UseDrawingHandlersProps) => {
	const generateId = () => Math.random().toString(36).substring(2, 15)

	const handleMouseDown = (e: MouseEvent) => {
		if (e.button === 2) {
			// Right click
			if (selectedShapeId()) {
				setShapes(shapes().filter(shape => shape.id !== selectedShapeId()))
				setSelectedShapeId(null)
			}
			return
		}

		const point = { x: e.clientX, y: e.clientY }

		/* start drawing */
		if (!isSelecting()) {
			setIsSelecting(true)
			setCurrentPoints([point])
		} else {
			setIsDrawing(true)
			setCurrentPoints([point])
			setCurrentPath(`M ${point.x} ${point.y}`)
		}
	}

	const handleMouseMove = (e: MouseEvent) => {
		const point = { x: e.clientX, y: e.clientY }

		if (isSelecting() && !isDrawing()) {
			setCurrentPoints([currentPoints()[0], point])
		} else if (isDrawing()) {
			setCurrentPoints([...currentPoints(), point])
			setCurrentPath((prev: string) => `${prev} L ${point.x} ${point.y}`)
		}
	}

	const handleMouseUp = async () => {
		if (currentPoints().length < 2) {
			setIsSelecting(false)
			setIsDrawing(false)
			setCurrentPoints([])
			setCurrentPath('')
			return
		}

		const newShape: Shape = {
			id: generateId(),
			type: isDrawing() ? ('path' as ShapeType) : ('rectangle' as ShapeType),
			color: primaryColor,
			points: currentPoints(),
		}

		setShapes([...shapes(), newShape])
		setIsDrawing(false)
		setIsSelecting(false)
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
