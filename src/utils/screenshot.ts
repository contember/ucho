import html2canvas from 'html2canvas-pro'
import type { Screenshot } from '~/types'

const shouldIgnoreElement = (element: Element): boolean => {
	return element.hasAttribute('data-hide-when-drawing')
}

export const captureScreenshot = async (): Promise<Screenshot | undefined> => {
	const style = document.createElement('style')
	try {
		document.head.appendChild(style)
		style.sheet?.insertRule('body > div:last-child img { display: inline-block; }')

		const canvas = await html2canvas(document.body, {
			logging: false,
			useCORS: true,
			scale: 1,
			allowTaint: true,
			ignoreElements: element => shouldIgnoreElement(element),
		})

		return canvas.toDataURL('image/jpeg', 0.7) as Screenshot
	} catch (error) {
		console.error('Failed to capture screenshot:', error)
		return undefined
	} finally {
		style.remove()
	}
}
