import { render } from 'solid-js/web'
import { Widget } from './components/Widget'
import { type EchoOptions, type FeedbackData, POSITIONS, type Position } from './types'

let activeInstance: (() => void) | null = null

const createMountPoint = (position: Position): HTMLDivElement => {
	const mountPoint = document.createElement('div')

	Object.assign(mountPoint.style, {
		position: 'fixed',
		zIndex: '999999',
		pointerEvents: 'none', // Only enable pointer events for the widget itself
		transform: 'translate3d(0,0,0)', // Force GPU acceleration
		...POSITIONS[position],
	})

	return mountPoint
}

const validateOptions = (options: EchoOptions): void => {
	if (typeof options !== 'object' || options === null) {
		throw new Error('Echo initialization failed: options must be an object')
	}

	if (typeof options.onSubmit !== 'function') {
		throw new Error('Echo initialization failed: onSubmit must be a function')
	}

	if (options.primaryColor && !/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(options.primaryColor)) {
		throw new Error('Echo initialization failed: primaryColor must be a valid hex color')
	}
}

/**
 * Initialize the Echo feedback widget.
 * @throws {Error} If initialization fails or invalid options are provided
 * @returns {() => void} Cleanup function to remove the widget
 */
export function initEcho(options: EchoOptions): () => void {
	// Prevent multiple instances
	if (activeInstance) {
		console.warn('Echo widget is already initialized. Cleaning up previous instance...')
		activeInstance()
	}

	try {
		validateOptions(options)

		const { position = 'bottom-right', primaryColor, onSubmit } = options
		const mountPoint = createMountPoint(position)

		queueMicrotask(() => {
			document.body.appendChild(mountPoint)
		})

		const dispose = render(
			() => (
				<Widget
					position={position}
					primaryColor={primaryColor}
					onSubmit={async data => {
						try {
							await onSubmit(data)
						} catch (error) {
							console.error('Error in Echo onSubmit handler:', error)
							throw error
						}
					}}
				/>
			),
			mountPoint,
		)

		const cleanup = () => {
			dispose()
			mountPoint.remove()
			activeInstance = null
		}

		// Handle unexpected unmounts
		const observer = new MutationObserver(mutations => {
			for (const mutation of mutations) {
				for (const node of Array.from(mutation.removedNodes)) {
					if (node === mountPoint || node.contains(mountPoint)) {
						cleanup()
						observer.disconnect()
						return
					}
				}
			}
		})

		observer.observe(document.body, { childList: true, subtree: true })

		window.addEventListener('unload', cleanup, { once: true })

		activeInstance = cleanup
		return cleanup
	} catch (error) {
		console.error('Echo initialization failed:', error)
		throw error
	}
}

export type { FeedbackData, EchoOptions, Position }
