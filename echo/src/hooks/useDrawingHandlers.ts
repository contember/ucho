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

				if (width > 10 && height > 10) {
					const screenshot = await html2canvas(document.body, {
						backgroundColor: null,
						logging: false,
						useCORS: true,
						scale: window.devicePixelRatio,
						allowTaint: true,
						foreignObjectRendering: true,
						ignoreElements: element => {
							return element.classList.contains('echo-widget') || element.classList.contains('echo-feedback-form')
						},
					})

					const canvas = document.createElement('canvas')
					canvas.width = screenshot.width
					canvas.height = screenshot.height
					const ctx = canvas.getContext('2d')

					if (ctx) {
						ctx.drawImage(screenshot, 0, 0)
						ctx.strokeStyle = primaryColor
						ctx.lineWidth = 3
						ctx.lineCap = 'round'

						for (const pathData of paths()) {
							const path = new Path2D(pathData)
							ctx.stroke(path)
						}

						setScreenshot(canvas.toDataURL() as Screenshot)
						setIsCapturing(false)
					}
				}
			}
		}
	}

	return {
		handleMouseDown,
		handleMouseMove,
		handleMouseUp,
	}
}
