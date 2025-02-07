import type { ConsoleEntry } from '~/types'

let consoleBuffer: ConsoleEntry[] = []
let originalConsole: { log: typeof console.log; warn: typeof console.warn; error: typeof console.error } | null = null
let originalOnError: typeof window.onerror | null = null
let originalOnUnhandledRejection: ((event: PromiseRejectionEvent) => void) | null = null

const createConsoleProxy = (type: ConsoleEntry['type'], originalFn: (...args: any[]) => void) => {
	return (...args: any[]) => {
		const getStringValue = (arg: any): string => {
			if (typeof arg === 'string') return arg
			if (arg instanceof Error) return arg.stack || arg.message

			try {
				const seen = new WeakSet()
				const replacer = (key: string, value: any) => {
					if (typeof value === 'object' && value !== null) {
						if (value instanceof Node) return `[${value.nodeName} Element]`
						if (seen.has(value)) return '[Circular Reference]'
						seen.add(value)
					}
					return value
				}
				return JSON.stringify(arg, replacer)
			} catch (err) {
				return '[Unable to stringify value]'
			}
		}

		const message = args.map(getStringValue).join(' ')

		consoleBuffer.push({
			type,
			message,
			timestamp: new Date().toISOString(),
		})

		if (consoleBuffer.length > 1000) {
			consoleBuffer = consoleBuffer.slice(-1000)
		}

		originalFn.apply(console, args)
	}
}

export const setupConsole = () => {
	if (originalConsole) return

	originalConsole = {
		log: console.log,
		warn: console.warn,
		error: console.error,
	}

	originalOnError = window.onerror
	originalOnUnhandledRejection = window.onunhandledrejection

	window.onerror = (message, source, lineno, colno, error) => {
		const errorMessage = error?.stack || error?.message || message
		consoleBuffer.push({
			type: 'error',
			message: `Uncaught Error: ${errorMessage}\nLocation: ${source}:${lineno}:${colno}`,
			timestamp: new Date().toISOString(),
		})

		if (originalOnError) {
			return originalOnError(message, source, lineno, colno, error)
		}
		return false
	}

	window.onunhandledrejection = event => {
		const error = event.reason
		consoleBuffer.push({
			type: 'error',
			message: `Unhandled Promise Rejection: ${error?.stack || error?.message || error}`,
			timestamp: new Date().toISOString(),
		})

		if (originalOnUnhandledRejection) {
			originalOnUnhandledRejection(event)
		}
	}

	console.log = createConsoleProxy('log', originalConsole.log)
	console.warn = createConsoleProxy('warn', originalConsole.warn)
	console.error = createConsoleProxy('error', originalConsole.error)

	window.addEventListener('error', event => {
		const { message, filename, lineno, colno, error } = event
		const errorMessage = error?.stack || error?.message || message
		consoleBuffer.push({
			type: 'error',
			message: `Uncaught Error: ${errorMessage}\nLocation: ${filename}:${lineno}:${colno}`,
			timestamp: new Date().toISOString(),
		})
	})
}

export const cleanupConsole = () => {
	if (originalConsole) {
		console.log = originalConsole.log
		console.warn = originalConsole.warn
		console.error = originalConsole.error
		originalConsole = null
	}
	if (originalOnError) {
		window.onerror = originalOnError
		originalOnError = null
	}
	if (originalOnUnhandledRejection) {
		window.onunhandledrejection = originalOnUnhandledRejection
		originalOnUnhandledRejection = null
	}
	window.removeEventListener('error', () => {})
	consoleBuffer = []
}

export const getConsoleBuffer = (): ConsoleEntry[] => [...consoleBuffer]
