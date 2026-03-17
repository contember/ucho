import { snapdom } from '@zumer/snapdom'
import type { SnapdomPlugin } from '@zumer/snapdom'
import type { Screenshot } from '~/types'

/**
 * Strips @layer wrappers from CSS while preserving inner rules.
 * SVG rendered as <img> (for canvas) ignores @layer entirely,
 * causing all layered rules to be dropped.
 */
const stripCSSLayers = (css: string): string => {
	// Remove @layer statement rules (e.g. @layer theme, base, utilities;)
	let result = css.replace(/@layer\s+[\w\s,.-]+;/g, '')

	// Unwrap @layer block rules — extract inner content
	let changed = true
	while (changed) {
		const before = result
		result = result.replace(/@layer\s+[\w.-]+\s*\{([\s\S]*?)\}/g, (_match, inner) => {
			return inner
		})
		changed = result !== before
	}

	return result
}

/**
 * Plugin that strips @layer wrappers from the serialized SVG string.
 * This runs after snapdom has already embedded images and computed styles,
 * but before toCanvas() converts it to an image — where @layer would be ignored.
 */
const stripLayersPlugin: SnapdomPlugin = {
	name: 'ucho-strip-layers',

	async afterRender(ctx) {
		if (!ctx.svgString) return

		const original = ctx.svgString
		ctx.svgString = ctx.svgString.replace(
			/<style([^>]*)>([\s\S]*?)<\/style>/g,
			(_fullMatch, attrs, cssContent) => {
				const processed = stripCSSLayers(cssContent)
				return `<style${attrs}>${processed}</style>`
			},
		)

		// Also update the data URL so toCanvas() uses the processed version
		if (ctx.dataURL && ctx.svgString !== original) {
			ctx.dataURL = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(ctx.svgString)}`
		}
	},
}

export const captureScreenshot = async (): Promise<Screenshot | undefined> => {
	try {
		const result = await snapdom(document.body, {
			scale: 1,
			dpr: 1,
			filter: (el: Element) => !el.hasAttribute('data-hide-when-drawing'),
			filterMode: 'hide',
			plugins: [stripLayersPlugin],
		})

		const canvas = await result.toCanvas()
		return canvas.toDataURL('image/jpeg', 0.7) as Screenshot
	} catch {
		return undefined
	}
}
