import type { EchoConfig } from '~/types'

export const validateOptions = (options: EchoConfig): void => {
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
