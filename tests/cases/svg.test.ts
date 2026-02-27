import { describe, expect, test } from 'bun:test'
import { generateCutoutPath } from '~/utils/svg'

const dims = { width: 800, height: 600 }
const basePath = 'M0 0 H800 V600 H0 Z'

describe('generateCutoutPath', () => {
	test('base path with no shapes or current points', () => {
		expect(generateCutoutPath(dims, [], [])).toBe(basePath)
	})

	test('path with current drawing (2 points)', () => {
		const result = generateCutoutPath(dims, [{ x: 100, y: 100 }, { x: 200, y: 200 }], [])
		expect(result).toBe(`${basePath} M100 100 h100 v100 h-100 v-100`)
	})

	test('ignores single current point', () => {
		expect(generateCutoutPath(dims, [{ x: 100, y: 100 }], [])).toBe(basePath)
	})

	test('path with existing rectangle shape', () => {
		const shapes = [{ type: 'rectangle', points: [{ x: 50, y: 50 }, { x: 150, y: 150 }] }]
		const result = generateCutoutPath(dims, [], shapes)
		expect(result).toBe(`${basePath} M50 50 h100 v100 h-100 v-100`)
	})

	test('multiple shapes combined', () => {
		const shapes = [
			{ type: 'rectangle', points: [{ x: 10, y: 10 }, { x: 20, y: 20 }] },
			{ type: 'rectangle', points: [{ x: 30, y: 30 }, { x: 50, y: 50 }] },
		]
		const result = generateCutoutPath(dims, [], shapes)
		expect(result).toBe(`${basePath} M10 10 h10 v10 h-10 v-10 M30 30 h20 v20 h-20 v-20`)
	})

	test('current drawing + shapes combined', () => {
		const shapes = [{ type: 'rectangle', points: [{ x: 50, y: 50 }, { x: 150, y: 150 }] }]
		const result = generateCutoutPath(dims, [{ x: 0, y: 0 }, { x: 10, y: 10 }], shapes)
		expect(result).toBe(`${basePath} M0 0 h10 v10 h-10 v-10 M50 50 h100 v100 h-100 v-100`)
	})

	test('non-rectangle shapes are ignored', () => {
		const shapes = [{ type: 'path', points: [{ x: 10, y: 10 }, { x: 20, y: 20 }] }]
		expect(generateCutoutPath(dims, [], shapes)).toBe(basePath)
	})
})
