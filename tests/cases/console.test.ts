import { afterEach, beforeEach, describe, expect, test } from 'bun:test'
import { cleanupConsole, getConsoleBuffer, setupConsole } from '~/utils/console'

// Mock window and Node for console module
beforeEach(() => {
	const listeners: Record<string, Function[]> = {}
	globalThis.window = {
		onunhandledrejection: null,
		addEventListener: (type: string, fn: Function) => {
			listeners[type] = listeners[type] || []
			listeners[type].push(fn)
		},
		removeEventListener: (type: string, fn: Function) => {
			if (listeners[type]) {
				listeners[type] = listeners[type].filter(f => f !== fn)
			}
		},
	} as any
	// Provide Node class so instanceof check doesn't throw
	if (typeof globalThis.Node === 'undefined') {
		(globalThis as any).Node = class Node {}
	}
})

afterEach(() => {
	cleanupConsole()
	delete (globalThis as any).window
})

describe('setupConsole', () => {
	test('wraps console.log/warn/error', () => {
		const originalLog = console.log
		setupConsole()
		expect(console.log).not.toBe(originalLog)
	})

	test('calling setupConsole twice is idempotent', () => {
		setupConsole()
		const wrappedLog = console.log
		setupConsole()
		expect(console.log).toBe(wrappedLog)
	})
})

describe('console interception', () => {
	test('intercepted log calls appear in buffer', () => {
		setupConsole()
		console.log('test message')
		const buffer = getConsoleBuffer()
		expect(buffer.length).toBe(1)
		expect(buffer[0].type).toBe('log')
		expect(buffer[0].message).toBe('test message')
	})

	test('intercepted warn calls appear in buffer', () => {
		setupConsole()
		console.warn('warning')
		const buffer = getConsoleBuffer()
		expect(buffer[0].type).toBe('warn')
	})

	test('intercepted error calls appear in buffer', () => {
		setupConsole()
		console.error('error')
		const buffer = getConsoleBuffer()
		expect(buffer[0].type).toBe('error')
	})

	test('buffer entries have timestamp', () => {
		setupConsole()
		console.log('test')
		const buffer = getConsoleBuffer()
		expect(buffer[0].timestamp).toBeDefined()
		expect(typeof buffer[0].timestamp).toBe('string')
	})

	test('string args pass through as-is', () => {
		setupConsole()
		console.log('hello', 'world')
		const buffer = getConsoleBuffer()
		expect(buffer[0].message).toBe('hello world')
	})

	test('objects get JSON-stringified', () => {
		setupConsole()
		console.log({ foo: 'bar' })
		const buffer = getConsoleBuffer()
		expect(buffer[0].message).toBe('{"foo":"bar"}')
	})

	test('circular references produce [Circular Reference]', () => {
		setupConsole()
		const obj: any = { a: 1 }
		obj.self = obj
		console.log(obj)
		const buffer = getConsoleBuffer()
		expect(buffer[0].message).toContain('[Circular Reference]')
	})
})

describe('buffer limits', () => {
	test('buffer caps at 1000 entries', () => {
		setupConsole()
		for (let i = 0; i < 1050; i++) {
			console.log(`msg ${i}`)
		}
		const buffer = getConsoleBuffer()
		expect(buffer.length).toBe(1000)
		// Should keep the latest entries
		expect(buffer[999].message).toBe('msg 1049')
	})
})

describe('cleanupConsole', () => {
	test('restores original console methods', () => {
		const originalLog = console.log
		const originalWarn = console.warn
		const originalError = console.error
		setupConsole()
		cleanupConsole()
		expect(console.log).toBe(originalLog)
		expect(console.warn).toBe(originalWarn)
		expect(console.error).toBe(originalError)
	})

	test('clears buffer', () => {
		setupConsole()
		console.log('test')
		expect(getConsoleBuffer().length).toBe(1)
		cleanupConsole()
		expect(getConsoleBuffer().length).toBe(0)
	})
})
