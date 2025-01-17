import html2canvas from 'html2canvas'
import { Screenshot } from '../types'
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
	primaryColor,
	setScreenshot,
	setIsCapturing,
}: UseDrawingHandlersProps) => {
	const handleMouseDown = (e: MouseEvent) => {
		if (!isSelecting()) {
			setIsSelecting(true)
			setStartPoint({ x: e.clientX, y: e.clientY })
			setEndPoint({ x: e.clientX, y: e.clientY })
		} else if (startPoint() && endPoint()) {
			setIsDrawing(true)
			const point = { x: e.clientX, y: e.clientY }
			setDrawingPoints([point])
			setCurrentPath(`M ${point.x} ${point.y}`)
		}
	}

	const handleMouseMove = (e: MouseEvent) => {
		if (isSelecting() && !isDrawing()) {
			setEndPoint({ x: e.clientX, y: e.clientY })
		} else if (isDrawing()) {
			const newPoint = { x: e.clientX, y: e.clientY }
			setDrawingPoints([...drawingPoints(), newPoint])
			setCurrentPath((prev: string) => `${prev} L ${newPoint.x} ${newPoint.y}`)
		}
	}

	const handleMouseUp = async () => {
		if (isDrawing()) {
			setIsDrawing(false)
			if (currentPath()) {
				setPaths([...paths(), currentPath()])
				setCurrentPath('')
			}
		} else {
			setIsSelecting(false)
			if (startPoint() && endPoint()) {
				const width = Math.abs(endPoint()!.x - startPoint()!.x)
				const height = Math.abs(endPoint()!.y - startPoint()!.y)

				setIsCapturing(false)
			}
		}
	}

	return {
		handleMouseDown,
		handleMouseMove,
		handleMouseUp,
	}
}
