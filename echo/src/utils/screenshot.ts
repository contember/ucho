import html2canvas from 'html2canvas'
import { Screenshot, Shape } from '~/types'

interface CaptureScreenshotConfig {
	annotations: Shape[]
}

const createCanvas = (width: number, height: number): HTMLCanvasElement => {
	const canvas = document.createElement('canvas')
	canvas.width = width
	canvas.height = height
	return canvas
}

const shouldIgnoreElement = (element: Element): boolean => {
	return (
		element.classList.contains('echo-widget-button') ||
		element.classList.contains('echo-feedback-form') ||
		element.classList.contains('echo-drawing-toolbar')
	)
}

// const drawAnnotations = (ctx: CanvasRenderingContext2D, annotations: Shape[]): void => {
// 	for (const annotation of annotations) {
// 		ctx.strokeStyle = annotation.color
// 		ctx.lineWidth = DEFAULT_CONFIG.strokeWidth
// 		ctx.lineCap = 'round'

// 		if (annotation.type === 'path' && annotation.points.length > 1) {
// 			const pathData = `M ${annotation.points[0].x} ${annotation.points[0].y} ${annotation.points
// 				.slice(1)
// 				.map(point => `L ${point.x} ${point.y}`)
// 				.join(' ')}`
// 			const path = new Path2D(pathData)
// 			ctx.stroke(path)
// 		} else if (annotation.type === 'rectangle' && annotation.points.length === 2) {
// 			const [startPoint, endPoint] = annotation.points
// 			const width = Math.abs(endPoint.x - startPoint.x)
// 			const height = Math.abs(endPoint.y - startPoint.y)
// 			ctx.strokeRect(Math.min(startPoint.x, endPoint.x), Math.min(startPoint.y, endPoint.y), width, height)
// 		}
// 	}
// }

export const captureScreenshot = async ({ annotations }: CaptureScreenshotConfig): Promise<Screenshot | undefined> => {
	try {
		const screenshot = await html2canvas(document.body, {
			backgroundColor: null,
			logging: false,
			useCORS: true,
			scale: 1,
			allowTaint: true,
			foreignObjectRendering: true,
			ignoreElements: shouldIgnoreElement,
		})

		const canvas = createCanvas(screenshot.width, screenshot.height)
		const ctx = canvas.getContext('2d')

		if (!ctx) {
			throw new Error('Failed to get canvas context')
		}

		ctx.drawImage(screenshot, 0, 0)

		// drawAnnotations(ctx, annotations)

		return canvas.toDataURL() as Screenshot
	} catch (error) {
		console.error('Failed to capture screenshot:', error)
		return undefined
	}
}
