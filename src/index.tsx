import { render } from 'solid-js/web'
import { Ucho } from './components/ucho'
import { defaultText } from './config/default-text'
import { Config } from './types'
import { deepMerge } from './utils/common'
import { validateOptions } from './utils/validators'

export type {
	BrowserInfo,
	CheckboxInputConfig,
	Config,
	ConsoleEntry,
	CustomInputConfig,
	CustomInputValue,
	FeedbackPayload,
	LocationInfo,
	Metadata,
	NetworkInfo,
	Position,
	RadioInputConfig,
	Screenshot,
	SelectInputConfig,
	SelectOption,
	TextAreaConfig,
	TextConfig,
	TextInputConfig,
	TimeInfo,
} from './types'

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
 *   primaryColor: '#1a1a1a',
 *   disableMinimization: false, // Optional: disable launcher button minimization
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
 * @param {Config} options - Configuration options for the Ucho widget
 * @param {Function} options.onSubmit - Required callback function that handles feedback submission. Return the API Response to enable success/error notifications
 * @param {Position} [options.position='bottom-right'] - Widget position on the page
 * @param {string} [options.primaryColor='#1a1a1a'] - Primary color for UI elements (must be a valid hex color)
 * @param {Partial<TextConfig>} [options.textConfig] - Custom text configuration for UI elements
 * @param {CustomInputConfig[]} [options.customInputs] - Configuration for custom input fields
 * @param {boolean} [options.disableMinimization=false] - Whether to disable the launcher button minimization after 4 seconds of inactivity
 *
 * @throws {Error} If initialization fails or invalid options are provided
 * @returns {() => void} Cleanup function that removes the widget when called
 */
export function init(options: Config): () => void {
	if (activeInstance) {
		console.warn('Ucho widget is already initialized. Cleaning up previous instance...')
		activeInstance()
	}

	try {
		validateOptions(options)

		const { position = 'bottom-right', primaryColor = '#1a1a1a', onSubmit, textConfig = {}, customInputs = [], disableMinimization = false, fancyIcon = false } = options
		const mergedTextConfig = deepMerge(defaultText, textConfig)

		const mountPoint = document.createElement('div')
		document.body.appendChild(mountPoint)

		const dispose = render(
			() => (
				<Ucho
					position={position}
					primaryColor={primaryColor}
					textConfig={mergedTextConfig}
					onSubmit={onSubmit}
					customInputs={customInputs}
					disableMinimization={disableMinimization}
					fancyIcon={fancyIcon}
				/>
			),
			mountPoint,
		)

		mountPoint.remove()

		const cleanup = () => {
			dispose()
			activeInstance = null
		}

		window.addEventListener('pagehide', cleanup, { once: true })

		activeInstance = cleanup
		return cleanup
	} catch (error) {
		console.error('Ucho initialization failed:', error)
		throw error
	}
}
