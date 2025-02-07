import { createSignal } from 'solid-js'
import { registerMutationObserver, registerWindowEventListener } from '~/utils/listeners'

export const usePageHeight = (element: HTMLElement | undefined) => {
	const [dimensions, setDimensions] = createSignal({
		width: document.documentElement.clientWidth,
		height: document.documentElement.scrollHeight,
	})

	const updateDimensions = () => {
		requestAnimationFrame(() => {
			if (!element) return

			element.style.height = '0px'
			element.style.height = `${document.documentElement.scrollHeight}px`

			setDimensions({
				width: document.documentElement.clientWidth,
				height: document.documentElement.scrollHeight,
			})
		})
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
			attributes: true,
		},
		callback: updateDimensions,
	})

	return dimensions
}
