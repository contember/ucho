import { describe, expect, test } from 'bun:test'
import { calculateLuminance, getContrastColor } from '~/utils/color'

describe('calculateLuminance', () => {
	test('black (#000000) has luminance 0', () => {
		expect(calculateLuminance('#000000')).toBe(0)
	})

	test('white (#FFFFFF) has luminance 1', () => {
		expect(calculateLuminance('#FFFFFF')).toBe(1)
	})

	test('pure red', () => {
		expect(calculateLuminance('#FF0000')).toBeCloseTo(0.2126, 4)
	})

	test('pure green', () => {
		expect(calculateLuminance('#00FF00')).toBeCloseTo(0.7152, 4)
	})

	test('pure blue', () => {
		expect(calculateLuminance('#0000FF')).toBeCloseTo(0.0722, 4)
	})

	test('works without # prefix', () => {
		expect(calculateLuminance('000000')).toBe(0)
	})
})

describe('getContrastColor', () => {
	test('black background → white text', () => {
		expect(getContrastColor('#000000')).toBe('#FFFFFF')
	})

	test('white background → black text', () => {
		expect(getContrastColor('#FFFFFF')).toBe('#000000')
	})

	test('dark color → white text', () => {
		expect(getContrastColor('#333333')).toBe('#FFFFFF')
	})

	test('light color → black text', () => {
		expect(getContrastColor('#CCCCCC')).toBe('#000000')
	})

	test('luminance exactly at 0.5 threshold → black text', () => {
		// luminance >= 0.5 returns black
		expect(getContrastColor('#BBBBBB')).toBe('#000000')
	})
})
