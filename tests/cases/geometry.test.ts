import { describe, expect, test } from 'bun:test'
import { getPathFromPoints, getRectFromPoints } from '~/utils/geometry'

describe('getRectFromPoints', () => {
	test('creates rectangle from two points', () => {
		expect(getRectFromPoints([{ x: 10, y: 20 }, { x: 50, y: 60 }])).toEqual({
			x: 10,
			y: 20,
			width: 40,
			height: 40,
		})
	})

	test('normalizes reversed points (end before start)', () => {
		expect(getRectFromPoints([{ x: 50, y: 60 }, { x: 10, y: 20 }])).toEqual({
			x: 10,
			y: 20,
			width: 40,
			height: 40,
		})
	})

	test('returns null for 0 points', () => {
		expect(getRectFromPoints([])).toBeNull()
	})

	test('returns null for 1 point', () => {
		expect(getRectFromPoints([{ x: 0, y: 0 }])).toBeNull()
	})

	test('returns null for 3+ points', () => {
		expect(getRectFromPoints([{ x: 0, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 2 }])).toBeNull()
	})
})

describe('getPathFromPoints', () => {
	test('generates SVG path from 2 points', () => {
		expect(getPathFromPoints([{ x: 10, y: 20 }, { x: 30, y: 40 }])).toBe('M 10 20 L 30 40')
	})

	test('generates SVG path from 3+ points', () => {
		expect(getPathFromPoints([{ x: 0, y: 0 }, { x: 10, y: 10 }, { x: 20, y: 0 }]))
			.toBe('M 0 0 L 10 10 L 20 0')
	})

	test('returns null for 0 points', () => {
		expect(getPathFromPoints([])).toBeNull()
	})

	test('returns null for 1 point', () => {
		expect(getPathFromPoints([{ x: 5, y: 5 }])).toBeNull()
	})
})
