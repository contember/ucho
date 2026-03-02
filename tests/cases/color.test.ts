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

	test('mid-gray with linearized luminance below 0.5 → white text', () => {
		// #BBBBBB linear luminance ≈ 0.48 with gamma correction
		expect(getContrastColor('#BBBBBB')).toBe('#FFFFFF')
	})

	test('lighter gray with linearized luminance above 0.5 → black text', () => {
		// #BCBCBC linear luminance ≈ 0.50 with gamma correction
		expect(getContrastColor('#BCBCBC')).toBe('#000000')
	})
})
