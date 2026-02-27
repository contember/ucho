import { describe, expect, test } from 'bun:test'
import { validateOptions } from '~/utils/validators'

describe('validateOptions', () => {
	const validOptions = { onSubmit: async () => {} }

	test('throws on null', () => {
		expect(() => validateOptions(null as any)).toThrow('options must be an object')
	})

	test('throws on undefined', () => {
		expect(() => validateOptions(undefined as any)).toThrow('options must be an object')
	})

	test('throws on non-object', () => {
		expect(() => validateOptions('string' as any)).toThrow('options must be an object')
	})

	test('throws when onSubmit is missing', () => {
		expect(() => validateOptions({} as any)).toThrow('onSubmit must be a function')
	})

	test('throws when onSubmit is not a function', () => {
		expect(() => validateOptions({ onSubmit: 'not-a-function' } as any)).toThrow('onSubmit must be a function')
	})

	test('throws on invalid primaryColor — missing #', () => {
		expect(() => validateOptions({ ...validOptions, primaryColor: 'FF0000' } as any)).toThrow('primaryColor must be a valid hex color')
	})

	test('throws on invalid primaryColor — too many chars', () => {
		expect(() => validateOptions({ ...validOptions, primaryColor: '#FF00000' } as any)).toThrow('primaryColor must be a valid hex color')
	})

	test('throws on invalid primaryColor — wrong format', () => {
		expect(() => validateOptions({ ...validOptions, primaryColor: '#GGG' } as any)).toThrow('primaryColor must be a valid hex color')
	})

	test('accepts valid 6-char hex color', () => {
		expect(() => validateOptions({ ...validOptions, primaryColor: '#FF0000' } as any)).not.toThrow()
	})

	test('accepts valid 3-char hex color', () => {
		expect(() => validateOptions({ ...validOptions, primaryColor: '#F00' } as any)).not.toThrow()
	})

	test('accepts config without primaryColor', () => {
		expect(() => validateOptions(validOptions as any)).not.toThrow()
	})
})
