import { createWrappedListener } from './listeners'

const originalAddEventListener = window.EventTarget.prototype.addEventListener
const originalRemoveEventListener = window.EventTarget.prototype.removeEventListener

let isPatched = false

const listenerMap = new WeakMap<EventTarget, Map<EventListenerOrEventListenerObject, EventListener>>()

export const registerOriginalListener = (
	target: EventTarget,
	type: string,
	listener: EventListenerOrEventListenerObject,
	options?: boolean | AddEventListenerOptions,
) => {
	originalAddEventListener.call(target, type, listener, options)
}

export const removeOriginalListener = (
	target: EventTarget,
	type: string,
	listener: EventListenerOrEventListenerObject,
	options?: boolean | EventListenerOptions,
) => {
	originalRemoveEventListener.call(target, type, listener, options)
}

export const patchEventTarget = (callback: (event: Event) => void) => {
	if (isPatched) {
		return
	}
	isPatched = true

	window.EventTarget.prototype.addEventListener = function (
		type: string,
		listener: EventListenerOrEventListenerObject,
		options?: boolean | AddEventListenerOptions,
	) {
		if (!listener) {
			return originalAddEventListener.call(this, type, listener, options)
		}

		const wrappedListener = createWrappedListener(listener, callback)

		if (!listenerMap.has(this)) {
			listenerMap.set(this, new Map())
		}

		const targetMap = listenerMap.get(this)!
		targetMap.set(listener, wrappedListener as EventListener)

		originalAddEventListener.call(this, type, wrappedListener as EventListener, options)
	}

	window.EventTarget.prototype.removeEventListener = function (
		type: string,
		listener: EventListenerOrEventListenerObject,
		options?: boolean | EventListenerOptions,
	) {
		if (!listener || typeof this !== 'object') {
			return originalRemoveEventListener.call(this, type, listener, options)
		}

		const targetMap = listenerMap.get(this)
		if (!targetMap) {
			return originalRemoveEventListener.call(this, type, listener, options)
		}

		const wrappedListener = targetMap.get(listener)
		if (wrappedListener) {
			originalRemoveEventListener.call(this, type, wrappedListener, options)
			targetMap.delete(listener)

			if (targetMap.size === 0) {
				listenerMap.delete(this)
			}
		} else {
			originalRemoveEventListener.call(this, type, listener, options)
		}
	}
}

export const unpatchEventTarget = () => {
	if (!isPatched) {
		return
	}
	window.EventTarget.prototype.addEventListener = originalAddEventListener
	window.EventTarget.prototype.removeEventListener = originalRemoveEventListener
	isPatched = false
}
