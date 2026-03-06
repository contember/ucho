import { createSignal } from 'solid-js'
import { registerMutationObserver, registerWindowEventListener } from '~/utils/listeners'

export const usePageHeight = (element: () => HTMLElement | undefined) => {
	const [dimensions, setDimensions] = createSignal({
		width: document.documentElement.clientWidth,
		height: document.documentElement.scrollHeight,
	})

	let rafId: number | undefined
	let debounceTimer: ReturnType<typeof setTimeout> | undefined

	const updateDimensions = () => {
		if (rafId !== undefined) return
		rafId = requestAnimationFrame(() => {
			rafId = undefined
			const el = element()
			if (!el) return

			const newHeight = document.documentElement.scrollHeight
			const newWidth = document.documentElement.clientWidth
			const current = dimensions()

			if (current.width === newWidth && current.height === newHeight) return

			el.style.height = `${newHeight}px`

			setDimensions({
				width: newWidth,
				height: newHeight,
			})
		})
	}

	const debouncedUpdateDimensions = () => {
		if (debounceTimer !== undefined) clearTimeout(debounceTimer)
		debounceTimer = setTimeout(updateDimensions, 100)
	}

	registerWindowEventListener({
		event: 'resize',
		callback: updateDimensions,
		onMount: updateDimensions,
	})

	registerMutationObserver({
		target: document.documentElement,
		options: {
			childList: true,
			subtree: true,
			attributes: false,
		},
		callback: debouncedUpdateDimensions,
	})

	return dimensions
}
