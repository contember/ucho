import { describe, expect, test } from 'bun:test'
import { getDistance } from '~/utils/events'

describe('getDistance', () => {
	test('horizontal distance', () => {
		expect(getDistance({ x: 0, y: 0 }, { x: 10, y: 0 })).toBe(10)
	})

	test('vertical distance', () => {
		expect(getDistance({ x: 0, y: 0 }, { x: 0, y: 7 })).toBe(7)
	})

	test('diagonal distance (3-4-5 triangle)', () => {
		expect(getDistance({ x: 0, y: 0 }, { x: 3, y: 4 })).toBe(5)
	})

	test('same point → 0', () => {
		expect(getDistance({ x: 5, y: 5 }, { x: 5, y: 5 })).toBe(0)
	})

	test('negative coordinates', () => {
		expect(getDistance({ x: -3, y: 0 }, { x: 0, y: 4 })).toBe(5)
	})
})
