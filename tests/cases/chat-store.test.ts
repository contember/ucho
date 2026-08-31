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

	test('breaks ties on id so the order is stable across polls', () => {
		const sameInstant = '2026-01-01T10:00:00Z'
		const merged = mergeMessages([], [message('b', sameInstant), message('a', sameInstant)])
		expect(merged.map(m => m.id)).toEqual(['a', 'b'])
	})
})
