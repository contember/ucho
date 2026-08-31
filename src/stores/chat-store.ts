import { createStore } from 'solid-js/store'
import type { ChatAvailability, ChatMessage, FullConfig, Screenshot } from '~/types'
import { collectLocationInfo, collectMetadata } from '~/utils/metadata'

export type ChatState = {
	isOpen: boolean
	messages: ChatMessage[]
	isLoading: boolean
	isSending: boolean
	/** History is fetched once, the first time the panel opens. */
	hasLoaded: boolean
	/** Set by the first batch from `subscribe`, which establishes what "already seen" means. */
	hasBaseline: boolean
	error: string | null
	unreadCount: number
	/** Captured through the drawing overlay and held until the next send. */
	pendingScreenshot?: Screenshot
	availability: ChatAvailability | null
}

export type ChatStore = {
	state: ChatState
	setState: (state: Partial<ChatState>) => void
	methods: {
		open: () => void
		close: () => void
		toggle: () => void
		attach: (screenshot: Screenshot) => void
		clearAttachment: () => void
		send: (text: string) => Promise<void>
		loadHistory: () => Promise<void>
		/** Starts the host's subscription; returns its teardown. */
		start: () => (() => void) | undefined
	}
}

/**
 * Adapters may return the whole transcript or only what is new, so messages are
 * merged by id rather than appended. Sorting by `createdAt` keeps a late-arriving
 * message in its right place; the id is a tiebreak so the order is stable.
 */
export const mergeMessages = (existing: ChatMessage[], incoming: ChatMessage[]): ChatMessage[] => {
	if (incoming.length === 0) return existing

	const byId = new Map(existing.map(message => [message.id, message]))
	for (const message of incoming) {
		byId.set(message.id, message)
	}

	return [...byId.values()].sort((a, b) => (
		a.createdAt === b.createdAt ? a.id.localeCompare(b.id) : a.createdAt.localeCompare(b.createdAt)
	))
}

export const createChatStore = (config: FullConfig): ChatStore => {
	const [state, setStoreState] = createStore<ChatState>({
		isOpen: false,
		messages: [],
		isLoading: false,
		isSending: false,
		hasLoaded: false,
		hasBaseline: false,
		error: null,
		unreadCount: 0,
		pendingScreenshot: undefined,
		availability: null,
	})

	const setState = (next: Partial<ChatState>) => setStoreState(next)

	const receive = (incoming: ChatMessage[]) => {
		const known = new Set(state.messages.map(message => message.id))
		const merged = mergeMessages(state.messages, incoming)

		// An adapter is allowed to push the whole transcript, and the first batch arrives
		// before any history load — counting it would greet a returning user with every
		// answer they have ever read. The first batch only establishes the baseline.
		const isBaseline = !state.hasBaseline

		// Only answers count as unread, and only while the panel is shut — a message
		// the user just sent themselves is not news to them.
		const unread = state.isOpen || isBaseline
			? state.isOpen ? 0 : state.unreadCount
			: state.unreadCount + incoming.filter(message => !known.has(message.id) && !message.author.isCustomer).length

		setState({ messages: merged, unreadCount: unread, hasBaseline: true })
	}

	const loadHistory = async () => {
		if (!config.chat || state.isLoading) return

		setState({ isLoading: true, error: null })
		try {
			const messages = await config.chat.history()
			setState({ messages: mergeMessages(state.messages, messages), hasLoaded: true })
		} catch {
			// Left unset on purpose: a failed history load is not a failed send, and the
			// panel says so with its empty state rather than a scary error.
			setState({ hasLoaded: false })
		} finally {
			setState({ isLoading: false })
		}
	}

	const loadAvailability = async () => {
		if (!config.chat?.availability) return
		try {
			setState({ availability: (await config.chat.availability()) ?? null })
		} catch {
			// Not knowing is fine — the panel simply says nothing about response times.
			setState({ availability: null })
		}
	}

	const open = () => {
		setState({ isOpen: true, unreadCount: 0 })
		if (!state.hasLoaded) void loadHistory()
		void loadAvailability()
	}

	const close = () => setState({ isOpen: false })

	const send = async (text: string) => {
		const trimmed = text.trim()
		if (!config.chat || state.isSending) return
		// A screenshot on its own is a complete message; text alone is too.
		if (!trimmed && !state.pendingScreenshot) return

		const screenshot = state.pendingScreenshot
		setState({ isSending: true, error: null })
		try {
			const messages = await config.chat.send({
				text: trimmed,
				screenshot,
				// Collected per message, not per conversation: in an SPA the user can move
				// between pages mid-conversation, and which page a message came from is
				// exactly what support needs to know.
				page: collectLocationInfo(),
				// Only with a screenshot: see the note on `ChatOutgoingMessage.metadata`.
				metadata: screenshot ? collectMetadata() : undefined,
			})
			if (messages.length === 0) {
				// Nothing came back, so nothing can be shown. Failing loudly beats clearing
				// the composer over an empty transcript and leaving the user to guess.
				throw new Error('chat.send resolved without any messages')
			}
			setState({ messages: mergeMessages(state.messages, messages), pendingScreenshot: undefined })
		} catch (error) {
			setState({ error: error instanceof Error ? error.message : 'send-failed' })
			throw error
		} finally {
			setState({ isSending: false })
		}
	}

	const start = () => config.chat?.subscribe(receive)

	return {
		state,
		setState,
		methods: {
			open,
			close,
			toggle: () => (state.isOpen ? close() : open()),
			attach: screenshot => setState({ pendingScreenshot: screenshot }),
			clearAttachment: () => setState({ pendingScreenshot: undefined }),
			send,
			loadHistory,
			start,
		},
	}
}
