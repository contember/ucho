import { render } from 'solid-js/web'
import { type EchoOptions, type FeedbackData, type Position } from '~/types'
import { Echo } from './components/Echo'

let activeInstance: (() => void) | null = null

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

		const { position = 'bottom-right', primaryColor = '#805AD5', onSubmit, textConfig } = options

		const dispose = render(
			() => (
				<Echo
					position={position}
					primaryColor={primaryColor}
					textConfig={textConfig}
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
			document.body,
		)

		const cleanup = () => {
			dispose()
			activeInstance = null
		}

		window.addEventListener('unload', cleanup, { once: true })

		activeInstance = cleanup
		return cleanup
	} catch (error) {
		console.error('Echo initialization failed:', error)
		throw error
	}
}

export type { FeedbackData, EchoOptions, Position }
