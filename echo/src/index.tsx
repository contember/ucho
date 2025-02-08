import { render } from 'solid-js/web'
import { Echo } from './components/Echo'
import { defaultText } from './config/defaultText'
import { type EchoConfig, type FeedbackPayload } from './types'
import { deepMerge } from './utils/common'
import { validateOptions } from './utils/validators'
import './styles.css'

let activeInstance: (() => void) | null = null

/**
 * Initialize the Echo feedback widget with the provided configuration.
 *
 * @description
 * This function creates and mounts the Echo feedback widget to your application.
 * Only one instance of Echo can be active at a time. If called multiple times,
 * the previous instance will be cleaned up before creating a new one.
 *
 * @example
 * ```typescript
 * initEcho({
 *   onSubmit: async (data) => {
 *     const response = await fetch('/api/feedback', {
 *       method: 'POST',
 *       body: JSON.stringify(data)
 *     });
 *     return response; // Return response to handle success/error notifications
 *   },
 *   position: 'bottom-right',
 *   primaryColor: '#6227dc',
 *   customInputs: [
 *     {
 *       id: 'category',
 *       type: 'select',
 *       label: 'Category',
 *       options: [
 *         { value: 'bug', label: 'Bug Report' },
 *         { value: 'feature', label: 'Feature Request' }
 *       ]
 *     }
 *   ]
 * });
 * ```
 *
 * @param {EchoConfig} options - Configuration options for the Echo widget
 * @param {Function} options.onSubmit - Required callback function that handles feedback submission. Return the API Response to enable success/error notifications
 * @param {Position} [options.position='bottom-right'] - Widget position on the page
 * @param {string} [options.primaryColor='#6227dc'] - Primary color for UI elements (must be a valid hex color)
 * @param {Partial<TextConfig>} [options.textConfig] - Custom text configuration for UI elements
 * @param {CustomInputConfig[]} [options.customInputs] - Configuration for custom input fields
 *
 * @throws {Error} If initialization fails or invalid options are provided
 * @returns {() => void} Cleanup function that removes the widget when called
 */
export function initEcho(options: EchoConfig): () => void {
	if (activeInstance) {
		console.warn('Echo widget is already initialized. Cleaning up previous instance...')
		activeInstance()
	}

	try {
		validateOptions(options)

		const { position = 'bottom-right', primaryColor = '#6227dc', onSubmit, textConfig = {}, customInputs = [] } = options
		const mergedTextConfig = deepMerge(defaultText, textConfig)

		const container = document.createElement('div')
		container.id = 'echo-container'
		document.body.appendChild(container)

		const dispose = render(
			() => <Echo position={position} primaryColor={primaryColor} textConfig={mergedTextConfig} onSubmit={onSubmit} customInputs={customInputs} />,
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
