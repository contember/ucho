import html2canvas from 'html2canvas-pro'
import type { Screenshot } from '~/types'

const shouldIgnoreElement = (element: Element): boolean => {
	return element.hasAttribute('data-hide-when-drawing')
}

const collectCrossOriginStylesheets = async (): Promise<string[]> => {
	const seen = new Set<string>()
	const tasks: Promise<string | null>[] = []

	for (const sheet of document.styleSheets) {
		if (sheet.disabled || (sheet.media.mediaText && !matchMedia(sheet.media.mediaText).matches)) {
			continue
		}
		try {
			// Same-origin — html2canvas already clones these, skip
			void sheet.cssRules
		} catch {
			// Cross-origin — need to fetch and inject manually
			if (sheet.href && !seen.has(sheet.href)) {
				seen.add(sheet.href)
				tasks.push(
					fetch(sheet.href, { signal: AbortSignal.timeout(5000) })
						.then(r => r.ok ? r.text() : null)
						.catch(() => null),
				)
			}
		}
	}

	return (await Promise.all(tasks)).filter((css): css is string => css !== null)
}

export const captureScreenshot = async (): Promise<Screenshot | undefined> => {
	try {
		const crossOriginStyles = await collectCrossOriginStylesheets()

		const canvas = await html2canvas(document.body, {
			logging: false,
			useCORS: true,
			scale: 1,
			allowTaint: true,
			ignoreElements: shouldIgnoreElement,
			onclone: (clonedDoc: Document) => {
				const style = clonedDoc.createElement('style')
				style.textContent = 'body > div:last-child img { display: inline-block; }'
				clonedDoc.head.appendChild(style)

				// Remove crossorigin from stylesheet links — the cloned iframe's
				// origin context differs, so CORS-marked links fail to load
				for (const link of clonedDoc.querySelectorAll('link[rel="stylesheet"][crossorigin]')) {
					link.removeAttribute('crossorigin')
				}

				for (const css of crossOriginStyles) {
					const styleEl = clonedDoc.createElement('style')
					styleEl.textContent = css
					clonedDoc.head.appendChild(styleEl)
				}
			},
		})

		return canvas.toDataURL('image/jpeg', 0.7) as Screenshot
	} catch (error) {
		console.error('Failed to capture screenshot:', error)
		return undefined
	}
}
