import { createWrappedListener } from './listeners'

const originalAddEventListener = window.EventTarget.prototype.addEventListener
const originalRemoveEventListener = window.EventTarget.prototype.removeEventListener

let isPatched = false
let echoShadowRoot: ShadowRoot | null = null

const listenerMap = new WeakMap<EventTarget, Map<EventListenerOrEventListenerObject, EventListener>>()

export const setShadowRoot = (shadowRoot: ShadowRoot | null) => {
	echoShadowRoot = shadowRoot
}

export const isNodeInEchoShadowRoot = (node: Node | null): boolean => {
	if (!echoShadowRoot || !node) {
		return false
	}

	if (node === echoShadowRoot) return true

	const rootNode = node.getRootNode()
	if (rootNode && rootNode.nodeName === '#document') {
		const topLayer = (rootNode as Document).querySelector('#top-layer')
		if (topLayer?.contains(node)) {
			return true
		}
	}

	let currentNode: Node | null = node
	while (currentNode) {
		if (currentNode.getRootNode() === echoShadowRoot) {
			return true
		}

		currentNode = currentNode.parentNode
	}

	return false
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
		if (!listener || typeof listener !== 'function') {
			return originalAddEventListener.call(this, type, listener, options)
		}

		const shouldWrap = this instanceof Node && !isNodeInEchoShadowRoot(this as Node)
		if (!shouldWrap) {
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

		const shouldUseOriginal = this instanceof Node && isNodeInEchoShadowRoot(this as Node)

		if (shouldUseOriginal) {
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
	echoShadowRoot = null
}
