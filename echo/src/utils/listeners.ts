import { onCleanup } from 'solid-js'
import { onMount } from 'solid-js'
import { isNodeInEchoShadowRoot } from './monkeyPatch'

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

	onMount(() => {
		mountCallback?.()
		window.addEventListener(event, callback)
	})

	onCleanup(() => {
		cleanupCallback?.()
		window.removeEventListener(event, callback)
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

export const createWrappedListener = (originalListener: EventListener, callback: (event: Event) => void) => {
	return function (this: EventTarget, event: Event) {
		if (!(event.target instanceof Node) || !isNodeInEchoShadowRoot(event.target)) {
			callback(event)
		}

		originalListener.call(this, event)
	}
}
