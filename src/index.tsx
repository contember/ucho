import { createSignal } from 'solid-js'
import { render } from 'solid-js/web'
import { Ucho } from './components/ucho'
import { defaultText } from './config/default-text'
import { Config, FullConfig } from './types'
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

/**
 * The cleanup function returned by {@link init}, with a `update` method for
 * changing configuration without tearing the widget down.
 */
export type UchoInstance = (() => void) & {
	/** Merge new options into the running widget. */
	update: (options: Partial<Config>) => void
}

const normalizeConfig = (options: Config): FullConfig => ({
	position: options.position ?? 'bottom-right',
	primaryColor: options.primaryColor ?? '#1a1a1a',
	onSubmit: options.onSubmit,
	textConfig: deepMerge(defaultText, options.textConfig ?? {}),
	customInputs: options.customInputs ?? [],
	disableMinimization: options.disableMinimization ?? false,
	fancyIcon: options.fancyIcon ?? false,
})

let activeInstance: UchoInstance | null = null

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
 * @returns {UchoInstance} Cleanup function that removes the widget when called,
 *   carrying an `update(options)` method that changes configuration in place
 */
export function init(options: Config): UchoInstance {
	if (activeInstance) {
		console.warn('Ucho widget is already initialized. Cleaning up previous instance...')
		activeInstance()
	}

	try {
		validateOptions(options)

		// Options live in a signal so they can be swapped without a remount: every
		// prop below is read through `config()`, which makes it reactive, and the
		// Provider already watches those props and pushes them into the store.
		let rawOptions = options
		const [config, setConfig] = createSignal<FullConfig>(normalizeConfig(options))

		const mountPoint = document.createElement('div')
		document.body.appendChild(mountPoint)

		const dispose = render(
			() => (
				<Ucho
					position={config().position}
					primaryColor={config().primaryColor}
					textConfig={config().textConfig}
					onSubmit={data => config().onSubmit(data)}
					customInputs={config().customInputs}
					disableMinimization={config().disableMinimization}
					fancyIcon={config().fancyIcon}
				/>
			),
			mountPoint,
		)

		mountPoint.remove()

		let disposed = false

		const cleanup = () => {
			if (disposed) return
			disposed = true
			dispose()
			activeInstance = null
		}

		const update = (next: Partial<Config>) => {
			if (disposed) return
			rawOptions = { ...rawOptions, ...next }
			validateOptions(rawOptions)
			setConfig(normalizeConfig(rawOptions))
		}

		window.addEventListener('pagehide', cleanup, { once: true })

		const instance: UchoInstance = Object.assign(cleanup, { update })
		activeInstance = instance
		return instance
	} catch (error) {
		console.error('Ucho initialization failed:', error)
		throw error
	}
}
