import html2canvas from 'html2canvas'
import type { Screenshot } from '~/types'

const createCanvas = (width: number, height: number): HTMLCanvasElement => {
	const canvas = document.createElement('canvas')
	canvas.width = width
	canvas.height = height
	return canvas
}

const shouldIgnoreElement = (element: Element): boolean => {
	return element.hasAttribute('data-hide-when-drawing')
}

export const captureScreenshot = async (): Promise<Screenshot | undefined> => {
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

		return canvas.toDataURL() as Screenshot
	} catch (error) {
		console.error('Failed to capture screenshot:', error)
		return undefined
	}
}
