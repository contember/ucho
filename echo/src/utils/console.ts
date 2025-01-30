import type { ConsoleEntry } from '~/types'

let consoleBuffer: ConsoleEntry[] = []
let originalConsole: { log: typeof console.log; warn: typeof console.warn; error: typeof console.error } | null = null
let originalOnError: typeof window.onerror | null = null
let originalOnUnhandledRejection: ((event: PromiseRejectionEvent) => void) | null = null

const createConsoleProxy = (type: ConsoleEntry['type'], originalFn: (...args: any[]) => void) => {
	return (...args: any[]) => {
		const message = args.map(arg => (typeof arg === 'string' ? arg : arg instanceof Error ? arg.stack || arg.message : JSON.stringify(arg))).join(' ')

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
