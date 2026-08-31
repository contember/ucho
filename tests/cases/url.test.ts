import { describe, expect, test } from 'bun:test'
import { safeMediaUrl } from '~/utils/url'

describe('safeMediaUrl', () => {
	test('allows http and https', () => {
		expect(safeMediaUrl('https://example.com/a.jpg')).toBe('https://example.com/a.jpg')
		expect(safeMediaUrl('http://example.com/a.jpg')).toBe('http://example.com/a.jpg')
	})

	test('allows a relative path, resolved against the page', () => {
		expect(safeMediaUrl('/files/a.jpg')).toBe('/files/a.jpg')
	})

	test('allows a data: URL only for images', () => {
		expect(safeMediaUrl('data:image/jpeg;base64,abc')).toBe('data:image/jpeg;base64,abc')
		expect(safeMediaUrl('data:text/html;base64,abc')).toBeNull()
		expect(safeMediaUrl('data:image/svg+xml;base64,abc')).toBeNull()
	})

	test('rejects javascript: however it is spelled', () => {
		expect(safeMediaUrl('javascript:alert(1)')).toBeNull()
		expect(safeMediaUrl('JavaScript:alert(1)')).toBeNull()
		expect(safeMediaUrl(' javascript:alert(1)')).toBeNull()
	})

	test('rejects other schemes and unparseable input', () => {
		expect(safeMediaUrl('vbscript:msgbox(1)')).toBeNull()
		expect(safeMediaUrl('file:///etc/passwd')).toBeNull()
		expect(safeMediaUrl(undefined)).toBeNull()
		expect(safeMediaUrl('')).toBeNull()
	})
})
