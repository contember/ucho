import { afterEach, beforeEach, describe, expect, test } from 'bun:test'
import { defaultText } from '~/config/default-text'
import { createStore } from '~/stores/store'
import type { FeedbackPayload, FullConfig } from '~/types'

const payload = { message: 'The totals overflow', metadata: {} } as FeedbackPayload

const configWith = (onSubmit: FullConfig['onSubmit']): FullConfig => ({
	onSubmit,
	position: 'bottom-right',
	primaryColor: '#6227dc',
	textConfig: defaultText,
	customInputs: [],
	disableMinimization: false,
	fancyIcon: false,
})

/** A promise the test settles when it chooses. */
const deferred = <T>() => {
	let resolve: (value: T) => void = () => {}
	const promise = new Promise<T>(settle => {
		resolve = settle
	})
	return { promise, resolve }
}

beforeEach(() => {
	const stored = new Map<string, string>()
	globalThis.localStorage = {
		getItem: (key: string) => stored.get(key) ?? null,
		setItem: (key: string, value: string) => stored.set(key, value),
		removeItem: (key: string) => stored.delete(key),
		clear: () => stored.clear(),
		key: (index: number) => [...stored.keys()][index] ?? null,
		get length() {
			return stored.size
		},
	} as any
	globalThis.window = {
		location: { pathname: '/cart', search: '' },
		dispatchEvent: () => true,
		setTimeout: globalThis.setTimeout,
		clearTimeout: globalThis.clearTimeout,
	} as any
	globalThis.document = { documentElement: { clientWidth: 1024, scrollHeight: 768 } } as any
})

afterEach(() => {
	delete (globalThis as any).localStorage
	delete (globalThis as any).window
	delete (globalThis as any).document
})

describe('submitting feedback', () => {
	test('a second press while the feedback is on its way sends nothing', async () => {
		const answer = deferred<Response>()
		const sent: FeedbackPayload[] = []
		const store = createStore(configWith(async data => {
			sent.push(data)
			return await answer.promise
		}))

		const first = store.methods.submit(async () => payload)
		const second = store.methods.submit(async () => payload)
		expect(store.feedback.state.isSubmitting).toBe(true)
		await second
		answer.resolve(new Response(null, { status: 204 }))
		await first

		expect(sent).toHaveLength(1)
		expect(store.feedback.state.isSubmitting).toBe(false)
	})

	test('a press while the screenshot is taken sends nothing either', async () => {
		const screenshot = deferred<FeedbackPayload>()
		let collected = 0
		let sent = 0
		const store = createStore(configWith(async () => {
			sent += 1
		}))
		const collect = () => {
			collected += 1
			return screenshot.promise
		}

		const first = store.methods.submit(collect)
		await store.methods.submit(collect)
		screenshot.resolve(payload)
		await first

		expect([collected, sent]).toEqual([1, 1])
	})

	test('feedback that failed can be sent again', async () => {
		let sent = 0
		const store = createStore(configWith(async () => {
			sent += 1
			return new Response(null, { status: 502 })
		}))

		await store.methods.submit(async () => payload)
		await store.methods.submit(async () => payload)

		expect(sent).toBe(2)
		expect(store.feedback.state.isSubmitting).toBe(false)
	})
})
