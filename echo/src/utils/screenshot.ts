import html2canvas from 'html2canvas'
import type { Screenshot } from '~/types'

const shouldIgnoreElement = (element: Element): boolean => {
	return element.hasAttribute('data-hide-when-drawing')
}

export const captureScreenshot = async (): Promise<Screenshot | undefined> => {
	try {
		const style = document.createElement('style')
		document.head.appendChild(style)
		style.sheet?.insertRule('body > div:last-child img { display: inline-block; }')

		const canvas = await html2canvas(document.body, {
			logging: false,
			useCORS: true,
			scale: window.devicePixelRatio,
			allowTaint: true,
			ignoreElements: element => shouldIgnoreElement(element),
		})

		style.remove()

		return canvas.toDataURL('image/png') as Screenshot
	} catch (error) {
		console.error('Failed to capture screenshot:', error)
		return undefined
	}
}
