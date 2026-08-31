import { describe, expect, test } from 'bun:test'
import { mergeMessages } from '~/stores/chat-store'
import type { ChatMessage } from '~/types'

const message = (id: string, createdAt: string, isCustomer = false): ChatMessage => ({
	id,
	createdAt,
	text: `message ${id}`,
	author: { name: isCustomer ? 'Customer' : 'Support', isCustomer },
})

describe('mergeMessages', () => {
	test('returns the existing list untouched when nothing arrives', () => {
		const existing = [message('a', '2026-01-01T10:00:00Z')]
		expect(mergeMessages(existing, [])).toBe(existing)
	})

	test('appends new messages in chronological order', () => {
		const merged = mergeMessages(
			[message('a', '2026-01-01T10:00:00Z')],
			[message('b', '2026-01-01T10:05:00Z')],
		)
		expect(merged.map(m => m.id)).toEqual(['a', 'b'])
	})

	test('deduplicates by id, so a full transcript can be sent every poll', () => {
		const existing = [message('a', '2026-01-01T10:00:00Z'), message('b', '2026-01-01T10:05:00Z')]
		const merged = mergeMessages(existing, existing)
		expect(merged.map(m => m.id)).toEqual(['a', 'b'])
	})

	test('a later copy of the same id wins', () => {
		const merged = mergeMessages(
			[message('a', '2026-01-01T10:00:00Z')],
			[{ ...message('a', '2026-01-01T10:00:00Z'), text: 'edited' }],
		)
		expect(merged).toHaveLength(1)
		expect(merged[0].text).toBe('edited')
	})

	test('sorts a late arrival into its right place rather than at the end', () => {
		const merged = mergeMessages(
			[message('a', '2026-01-01T10:00:00Z'), message('c', '2026-01-01T10:10:00Z')],
			[message('b', '2026-01-01T10:05:00Z')],
		)
		expect(merged.map(m => m.id)).toEqual(['a', 'b', 'c'])
	})

	test('orders by instant, not by string — fractional precision must not reverse it', () => {
		const merged = mergeMessages(
			[message('older', '2026-01-01T10:00:00Z')],
			[message('newer', '2026-01-01T10:00:00.250Z')],
		)
		expect(merged.map(m => m.id)).toEqual(['older', 'newer'])
	})

	test('orders by instant across timezone offsets', () => {
		// 23:00-05:00 is 04:00Z the next day, i.e. after 00:00Z — the shape a timestamptz
		// column produces.
		const merged = mergeMessages(
			[message('utc', '2026-01-02T00:00:00Z')],
			[message('offset', '2026-01-01T23:00:00-05:00')],
		)
		expect(merged.map(m => m.id)).toEqual(['utc', 'offset'])
	})

	test('treats the same instant spelled two ways as a tie', () => {
		const merged = mergeMessages(
			[message('b', '2026-01-01T10:00:00.000Z')],
			[message('a', '2026-01-01T10:00:00Z')],
		)
		expect(merged.map(m => m.id)).toEqual(['a', 'b'])
	})

	test('breaks ties on id so the order is stable across polls', () => {
		const sameInstant = '2026-01-01T10:00:00Z'
		const merged = mergeMessages([], [message('b', sameInstant), message('a', sameInstant)])
		expect(merged.map(m => m.id)).toEqual(['a', 'b'])
	})
})
