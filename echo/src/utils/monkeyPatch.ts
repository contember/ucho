import { createWrappedListener } from './listeners'

const originalAddEventListener = window.EventTarget.prototype.addEventListener
const originalRemoveEventListener = window.EventTarget.prototype.removeEventListener

let isPatched = false

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

const listenerMap = new WeakMap<EventTarget, WeakMap<EventListenerOrEventListenerObject, EventListener>>()

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
		const wrappedListener = createWrappedListener(listener, callback)

		if (!listenerMap.has(this)) {
			listenerMap.set(this, new WeakMap())
		}
		listenerMap.get(this)!.set(listener, wrappedListener as EventListener)

		originalAddEventListener.call(this, type, wrappedListener as EventListener, options)
	}

	window.EventTarget.prototype.removeEventListener = function (
		type: string,
		listener: EventListenerOrEventListenerObject,
		options?: boolean | EventListenerOptions,
	) {
		const wrappedListener = listenerMap.get(this)?.get(listener)
		if (wrappedListener) {
			originalRemoveEventListener.call(this, type, wrappedListener, options)
			listenerMap.get(this)?.delete(listener)
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
