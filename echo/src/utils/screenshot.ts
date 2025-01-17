import html2canvas from 'html2canvas'
import { Point, Screenshot } from '../types'

interface AnnotationBase {
	color: string
	strokeWidth?: number
}

interface PathAnnotation extends AnnotationBase {
	type: 'path'
	path: string
}

interface RectAnnotation extends AnnotationBase {
	type: 'rect'
	startPoint: Point
	endPoint: Point
}

type Annotation = PathAnnotation | RectAnnotation

interface CaptureScreenshotConfig {
	annotations: Annotation[]
}

const DEFAULT_CONFIG = {
	strokeWidth: 3,
}

const createCanvas = (width: number, height: number): HTMLCanvasElement => {
	const canvas = document.createElement('canvas')
	canvas.width = width
	canvas.height = height
	return canvas
}

const shouldIgnoreElement = (element: Element): boolean => {
	return element.classList.contains('echo-widget') || element.classList.contains('echo-feedback-form')
}

const drawAnnotations = (ctx: CanvasRenderingContext2D, annotations: Annotation[]): void => {
	for (const annotation of annotations) {
		ctx.strokeStyle = annotation.color
		ctx.lineWidth = annotation.strokeWidth || DEFAULT_CONFIG.strokeWidth
		ctx.lineCap = 'round'

		if (annotation.type === 'path') {
			const path = new Path2D(annotation.path)
			ctx.stroke(path)
		} else if (annotation.type === 'rect') {
			const { startPoint, endPoint } = annotation
			const width = Math.abs(endPoint.x - startPoint.x)
			const height = Math.abs(endPoint.y - startPoint.y)
			ctx.strokeRect(Math.min(startPoint.x, endPoint.x), Math.min(startPoint.y, endPoint.y), width, height)
		}
	}
}

export const captureScreenshot = async ({ annotations }: CaptureScreenshotConfig): Promise<Screenshot | undefined> => {
	try {
		const screenshot = await html2canvas(document.body, {
			backgroundColor: null,
			logging: false,
			useCORS: true,
			scale: window.devicePixelRatio,
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

		drawAnnotations(ctx, annotations)

		return canvas.toDataURL() as Screenshot
	} catch (error) {
		console.error('Failed to capture screenshot:', error)
		return undefined
	}
}
