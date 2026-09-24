import { createStore } from 'solid-js/store'
import type { ChatAvailability, ChatMessage, ChatTranscript, FullConfig, Screenshot } from '~/types'
import { collectLocationInfo, collectMetadata } from '~/utils/metadata'
import { getFromStorage, setToStorage } from '~/utils/storage'

const EXPANDED_KEY = 'chat_expanded'

/** The attachment the viewer is showing, if any. */
export type ChatImageView = {
	url: string
	label: string
}

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
	/** An attachment opened out of the transcript, shown at the size it was taken. */
	viewedImage: ChatImageView | null
	/**
	 * The panel at the size of the viewport rather than a corner of it. Remembered across
	 * page loads: whoever needed room to read one long answer will need it for the next.
	 */
	isExpanded: boolean
	/**
	 * The oldest answer that was unread when the panel was last opened, so the panel can
	 * start there. Opening clears the count, which is the only other record of it.
	 */
	firstUnreadId: string | null
	availability: ChatAvailability | null
}

export type ChatStore = {
	state: ChatState
	/**
	 * Whether the host currently supplies an adapter. Read live, so `update({ chat: undefined })`
	 * takes the panel out of the way. Note the reverse is not supported: chat that was absent
	 * at `init()` cannot be added later, because the store is only built when it is present.
	 */
	isAvailable: () => boolean
	setState: (state: Partial<ChatState>) => void
	methods: {
		open: () => void
		close: () => void
		toggle: () => void
		attach: (screenshot: Screenshot) => void
		clearAttachment: () => void
		viewImage: (image: ChatImageView) => void
		closeImage: () => void
		toggleExpanded: () => void
		send: (text: string) => Promise<void>
		loadHistory: () => Promise<void>
		/** Asked separately by the menu, which advertises response times without opening the panel. */
		loadAvailability: () => Promise<void>
		/** Starts the host's subscription; returns its teardown. */
		start: () => (() => void) | undefined
	}
}

/**
 * Adapters may report the whole transcript or only what changed, so messages are
 * upserted by id rather than appended — which is also how an edit arrives. Removals
 * are applied from `removed`, never inferred from a message being absent. Sorting by
 * `createdAt` keeps a late arrival in its right place; the id is a stable tiebreak.
 */
export const mergeMessages = (existing: ChatMessage[], incoming: ChatMessage[], removed?: string[]): ChatMessage[] => {
	if (incoming.length === 0 && !removed?.length) return existing

	const byId = new Map(existing.map(message => [message.id, message]))
	for (const message of incoming) {
		byId.set(message.id, message)
	}
	for (const id of removed ?? []) {
		byId.delete(id)
	}

	// Compared as instants, not as strings: adapters differ in fractional precision and
	// timezone offset, and `'…00.250Z'` sorts before `'…00Z'` lexically while `-05:00`
	// offsets sort as if they were UTC. Ties fall back to the id so polls are stable.
	return [...byId.values()].sort((a, b) => {
		const at = Date.parse(a.createdAt)
		const bt = Date.parse(b.createdAt)
		if (at === bt || Number.isNaN(at) || Number.isNaN(bt)) return a.id < b.id ? -1 : a.id > b.id ? 1 : 0
		return at - bt
	})
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
		viewedImage: null,
		isExpanded: getFromStorage(EXPANDED_KEY, false),
		firstUnreadId: null,
		availability: null,
	})

	const setState = (next: Partial<ChatState>) => setStoreState(next)

	const receive = (transcript: ChatTranscript) => {
		const incoming = transcript.messages
		const known = new Set(state.messages.map(message => message.id))
		const merged = mergeMessages(state.messages, incoming, transcript.removed)

		// An adapter is allowed to push the whole transcript, and the first batch arrives
		// before any history load — counting it would greet a returning user with every
		// answer they have ever read. The first batch only establishes the baseline.
		const isBaseline = !state.hasBaseline

		// A retracted answer stops being unread: leaving it counted would leave a badge
		// pointing at a message the user can never open.
		const byId = new Map(state.messages.map(message => [message.id, message]))
		const retractedUnread = (transcript.removed ?? [])
			.filter(id => byId.get(id)?.author.isCustomer === false).length

		// Only answers count as unread, and only while the panel is shut — a message
		// the user just sent themselves is not news to them.
		const unread = state.isOpen || isBaseline
			? state.isOpen ? 0 : state.unreadCount
			: state.unreadCount + incoming.filter(message => !known.has(message.id) && !message.author.isCustomer).length

		setState({ messages: merged, unreadCount: Math.max(0, unread - retractedUnread), hasBaseline: true })
	}

	const loadHistory = async () => {
		if (!config.chat || state.isLoading) return

		setState({ isLoading: true, error: null })
		try {
			const transcript = await config.chat.history()
			// Establishing the baseline here — rather than from the first `subscribe` batch —
			// keeps a delta-only adapter's first reply countable while still not greeting a
			// returning user with every answer they have already read.
			setState({
				messages: mergeMessages(state.messages, transcript.messages, transcript.removed),
				hasLoaded: true,
				hasBaseline: true,
			})
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
		// Unread answers are the ones that arrived last, so the count says where they start.
		const answers = state.messages.filter(message => !message.author.isCustomer)
		const firstUnread = state.unreadCount > 0 ? answers[Math.max(0, answers.length - state.unreadCount)] : undefined
		setState({ isOpen: true, unreadCount: 0, firstUnreadId: firstUnread?.id ?? null })
		if (!state.hasLoaded) void loadHistory()
		void loadAvailability()
	}

	// The viewer is cleared with the panel. It is rendered outside it (a modal dialog cannot
	// live under an animated ancestor), so nothing else would take it off the screen.
	const close = () => setState({ isOpen: false, error: null, viewedImage: null })

	const send = async (text: string) => {
		const trimmed = text.trim()
		if (state.isSending) return
		if (!config.chat) {
			// Resolving here would let the panel clear the composer over a message that
			// was never sent anywhere.
			throw new Error('Chat is not configured')
		}
		// A screenshot on its own is a complete message; text alone is too.
		if (!trimmed && !state.pendingScreenshot) return

		const screenshot = state.pendingScreenshot
		setState({ isSending: true, error: null })
		try {
			const transcript = await config.chat.send({
				text: trimmed,
				screenshot,
				// Collected per message, not per conversation: in an SPA the user can move
				// between pages mid-conversation, and which page a message came from is
				// exactly what support needs to know.
				page: collectLocationInfo(),
				// Only with a screenshot: see the note on `ChatOutgoingMessage.metadata`.
				metadata: screenshot ? collectMetadata() : undefined,
			})
			if (transcript.messages.length === 0) {
				// Nothing came back, so nothing can be shown. Failing loudly beats clearing
				// the composer over an empty transcript and leaving the user to guess.
				throw new Error('chat.send resolved without any messages')
			}
			setState({
				messages: mergeMessages(state.messages, transcript.messages, transcript.removed),
				pendingScreenshot: undefined,
			})
		} catch (error) {
			setState({ error: error instanceof Error ? error.message : 'send-failed' })
			throw error
		} finally {
			setState({ isSending: false })
		}
	}

	const start = () => {
		// Loaded up front, not on first open: the unread badge is only meaningful once we
		// know what was already there.
		void loadHistory()
		return config.chat?.subscribe(receive)
	}

	return {
		state,
		isAvailable: () => !!config.chat,
		setState,
		methods: {
			open,
			close,
			toggle: () => (state.isOpen ? close() : open()),
			attach: screenshot => setState({ pendingScreenshot: screenshot }),
			clearAttachment: () => setState({ pendingScreenshot: undefined }),
			viewImage: image => setState({ viewedImage: image }),
			closeImage: () => setState({ viewedImage: null }),
			toggleExpanded: () => {
				const isExpanded = !state.isExpanded
				setState({ isExpanded })
				setToStorage(EXPANDED_KEY, isExpanded)
			},
			send,
			loadHistory,
			loadAvailability,
			start,
		},
	}
}
