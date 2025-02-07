import { onCleanup } from 'solid-js'
import { onMount } from 'solid-js'
import { registerOriginalListener, removeOriginalListener } from './monkeyPatch'

export const registerWindowEventListener: {
	<K extends keyof WindowEventMap>(props: {
		event: K
		callback: (e: WindowEventMap[K]) => void
		onMount?: () => void
		onCleanup?: () => void
		useOriginal?: boolean
	}): void
	(props: {
		event: string
		callback: (e: Event) => void
		onMount?: () => void
		onCleanup?: () => void
		useOriginal?: boolean
	}): void
} = (props: any) => {
	const { event, callback, onMount: mountCallback, onCleanup: cleanupCallback, useOriginal = true } = props

	onMount(() => {
		mountCallback?.()
		if (useOriginal) {
			registerOriginalListener(window, event, callback)
		} else {
			window.addEventListener(event, callback)
		}
	})

	onCleanup(() => {
		cleanupCallback?.()
		if (useOriginal) {
			removeOriginalListener(window, event, callback)
		} else {
			window.removeEventListener(event, callback)
		}
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

export const createWrappedListener = (originalListener: EventListenerOrEventListenerObject, callback: (event: Event) => void) => {
	return function (this: EventTarget, event: Event) {
		callback(event)

		if (typeof originalListener === 'function') {
			originalListener.call(this, event)
		} else {
			originalListener.handleEvent(event)
		}
	}
}
