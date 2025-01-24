import { createSignal, onCleanup, onMount } from 'solid-js'
import { ViewportState } from '../types'

export const useViewport = (): ViewportState => {
	const [width, setWidth] = createSignal(window.innerWidth)
	const [height, setHeight] = createSignal(window.innerHeight)

	const handleResize = () => {
		setWidth(window.innerWidth)
		setHeight(window.innerHeight)
	}

	onMount(() => {
		window.addEventListener('resize', handleResize)
	})

	onCleanup(() => {
		window.removeEventListener('resize', handleResize)
	})

	return {
		width: width(),
		height: height(),
	}
}
