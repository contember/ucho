import { render } from 'solid-js/web'
import { Echo } from './components/Echo'
import { defaultText } from './config/defaultText'
import { type EchoConfig, type FeedbackPayload } from './types'
import { deepMerge } from './utils/common'
import { validateOptions } from './utils/validators'
import './styles.css'

let activeInstance: (() => void) | null = null

/**
 * Initialize the Echo feedback widget.
 * @throws {Error} If initialization fails or invalid options are provided
 * @returns {() => void} Cleanup function to remove the widget
 */
export function initEcho(options: EchoConfig): () => void {
	if (activeInstance) {
		console.warn('Echo widget is already initialized. Cleaning up previous instance...')
		activeInstance()
	}

	try {
		validateOptions(options)

		const { position = 'bottom-right', primaryColor = '#6227dc', onSubmit, textConfig = {} } = options
		const mergedTextConfig = deepMerge(defaultText, textConfig)

		const container = document.createElement('div')
		container.id = 'echo-container'
		document.body.appendChild(container)

		const dispose = render(
			() => <Echo position={position} primaryColor={primaryColor} textConfig={mergedTextConfig} onSubmit={onSubmit} />,
			container,
		)

		const cleanup = () => {
			dispose()
			container.remove()
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

export type { FeedbackPayload, EchoConfig }
