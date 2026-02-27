import { describe, expect, test } from 'bun:test'
import { deepMerge } from '~/utils/common'

describe('deepMerge', () => {
	test('shallow merge', () => {
		expect(deepMerge({ a: 1 }, { b: 2 })).toEqual({ a: 1, b: 2 })
	})

	test('nested object merge', () => {
		const target = { a: { x: 1, y: 2 } }
		const source = { a: { y: 3, z: 4 } }
		expect(deepMerge(target, source)).toEqual({ a: { x: 1, y: 3, z: 4 } })
	})

	test('source overrides target scalar values', () => {
		expect(deepMerge({ a: 1 }, { a: 2 })).toEqual({ a: 2 })
	})

	test('arrays replace, not merge', () => {
		expect(deepMerge({ a: [1, 2] }, { a: [3, 4, 5] })).toEqual({ a: [3, 4, 5] })
	})

	test('null source returns target', () => {
		const target = { a: 1 }
		expect(deepMerge(target, null)).toEqual({ a: 1 })
	})

	test('undefined source returns target', () => {
		const target = { a: 1 }
		expect(deepMerge(target, undefined)).toEqual({ a: 1 })
	})

	test('does not mutate original target', () => {
		const target = { a: { b: 1 } }
		const result = deepMerge(target, { a: { c: 2 } })
		expect(target).toEqual({ a: { b: 1 } })
		expect(result).toEqual({ a: { b: 1, c: 2 } })
	})
})
