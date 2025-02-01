import { onCleanup } from 'solid-js'
import { onMount } from 'solid-js'

export const registerKeyListener = (key: string, callback: (e: KeyboardEvent) => void) => {
	registerWindowEventListener({
		event: 'keydown',
		callback: e => {
			if (e.key === key) {
				callback(e)
			}
		},
	})
}

export const registerWindowEventListener: {
	<K extends keyof WindowEventMap>(props: {
		event: K
		callback: (e: WindowEventMap[K]) => void
		onMount?: () => void
		onCleanup?: () => void
	}): void
	(props: {
		event: string
		callback: (e: Event) => void
		onMount?: () => void
		onCleanup?: () => void
	}): void
} = (props: any) => {
	const { event, callback, onMount: mountCallback, onCleanup: cleanupCallback } = props
	const handleEvent = (e: Event) => {
		callback(e)
	}

	onMount(() => {
		mountCallback?.()
		window.addEventListener(event, handleEvent)
	})

	onCleanup(() => {
		cleanupCallback?.()
		window.removeEventListener(event, handleEvent)
	})
}
export const registerMutationObserver = (props: {
	target: Node
	options?: MutationObserverInit
	callback: (mutations: MutationRecord[]) => void
	onMount?: () => void
	onCleanup?: () => void
}) => {
	const { target, options, callback, onMount: mountCallback, onCleanup: cleanupCallback } = props
	const observer = new MutationObserver(callback)

	onMount(() => {
		mountCallback?.()
		observer.observe(target, options)
	})

	onCleanup(() => {
		cleanupCallback?.()
		observer.disconnect()
	})
}
