import { type Component, createEffect, createSignal, For, onCleanup, onMount, Show } from 'solid-js'
import { Button } from '~/components/button'
import { ImageIcon, SendIcon, XIcon } from '~/components/icons'
import { useStore } from '~/contexts'
import type { ChatMessage } from '~/types'
import { registerWindowEventListener } from '~/utils/listeners'

const formatTime = (createdAt: string): string => {
	const date = new Date(createdAt)
	if (Number.isNaN(date.getTime())) return ''
	return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
}

/**
 * The support conversation. Non-modal on purpose: unlike the feedback overlay this
 * has to stay usable while the user keeps working, so it never calls `showModal()`
 * and never covers the page.
 */
export const ChatPanel: Component = () => {
	const store = useStore()
	const chat = store.chat
	if (!chat) return null

	let listRef: HTMLDivElement | undefined
	let inputRef: HTMLTextAreaElement | undefined
	const [draft, setDraft] = createSignal('')

	onMount(() => {
		const unsubscribe = chat.methods.start()
		onCleanup(() => unsubscribe?.())
	})

	// Follow the conversation as it grows, and when the panel is (re)opened.
	createEffect(() => {
		const count = chat.state.messages.length
		if (!chat.state.isOpen || !listRef || count === 0) return
		queueMicrotask(() => listRef?.scrollTo({ top: listRef.scrollHeight }))
	})

	createEffect(() => {
		if (chat.state.isOpen) queueMicrotask(() => inputRef?.focus())
	})

	registerWindowEventListener({
		event: 'keydown',
		callback: (event: KeyboardEvent) => {
			if (event.key === 'Escape' && chat.state.isOpen) chat.methods.close()
		},
	})

	const submit = async () => {
		const text = draft().trim()
		if (!text) return

		try {
			// Cleared only once the send is confirmed: clearing up front loses the text
			// whenever the adapter rejects or answers with nothing to display.
			await chat.methods.send(text)
			setDraft('')
		} catch {
			// The draft is still in the composer, so there is something to retry from.
		} finally {
			// The composer is `disabled` while sending, which blurs it — and because the
			// widget lives in a shadow root, focus would land on the host page's body and
			// send every later keystroke there.
			queueMicrotask(() => inputRef?.focus())
		}
	}

	return (
		<Show when={chat.state.isOpen}>
			<div class="ucho-popover ucho-chat" role="dialog" aria-label={store.widget.state.text.chat.title}>
				<div class="ucho-chat-header">
					<div class="ucho-chat-heading">
						<h3>{store.widget.state.text.chat.title}</h3>
						<Show when={chat.state.availability?.message}>
							<p class="ucho-chat-availability" data-state={chat.state.availability?.state}>
								{chat.state.availability?.message}
							</p>
						</Show>
					</div>
					<Button
						variant="secondary"
						size="sm"
						title={store.widget.state.text.chat.closeTitle}
						aria-label={store.widget.state.text.chat.closeTitle}
						onClick={() => chat.methods.close()}
					>
						<XIcon size={18} />
					</Button>
				</div>

				<div class="ucho-chat-messages" ref={listRef}>
					<Show when={!chat.state.isLoading} fallback={<p class="ucho-chat-empty">{store.widget.state.text.chat.loading}</p>}>
						<Show
							when={chat.state.messages.length > 0}
							fallback={
								<div class="ucho-chat-empty">
									<p>{store.widget.state.text.chat.emptyState}</p>
									<Button
										class="ucho-chat-empty-action"
										variant="secondary"
										size="sm"
										onClick={() => {
											chat.methods.close()
											store.widget.setState({ isOpen: true })
										}}
									>
										{store.widget.state.text.chat.feedbackLink}
									</Button>
								</div>
							}
						>
							<For each={chat.state.messages}>
								{(message: ChatMessage) => (
									<div class="ucho-chat-message" data-customer={message.author.isCustomer}>
										<div class="ucho-chat-bubble">
											<Show when={!message.author.isCustomer}>
												<span class="ucho-chat-author">{message.author.name}</span>
											</Show>
											<Show when={message.text}>
												<p class="ucho-chat-text">{message.text}</p>
											</Show>
											<Show when={message.screenshot}>
												<img class="ucho-chat-shot" src={message.screenshot} alt={store.widget.state.text.chat.attachmentLabel} />
											</Show>
										</div>
										<time class="ucho-chat-time" dateTime={message.createdAt}>{formatTime(message.createdAt)}</time>
									</div>
								)}
							</For>
						</Show>
					</Show>
				</div>

				<Show when={chat.state.error}>
					<p class="ucho-chat-error" role="alert">{store.widget.state.text.chat.errorMessage}</p>
				</Show>

				<Show when={chat.state.pendingScreenshot}>
					<div class="ucho-chat-pending">
						<img class="ucho-chat-pending-thumb" src={chat.state.pendingScreenshot} alt={store.widget.state.text.chat.attachmentLabel} />
						<span class="ucho-chat-pending-label">{store.widget.state.text.chat.attachmentLabel}</span>
						<Button
							variant="secondary"
							size="sm"
							title={store.widget.state.text.chat.removeAttachment}
							aria-label={store.widget.state.text.chat.removeAttachment}
							onClick={() => chat.methods.clearAttachment()}
						>
							<XIcon size={16} />
						</Button>
					</div>
				</Show>

				<form
					class="ucho-chat-composer"
					onSubmit={event => {
						event.preventDefault()
						void submit()
					}}
				>
					<textarea
						ref={inputRef}
						class="ucho-chat-input"
						rows={1}
						placeholder={store.widget.state.text.chat.placeholder}
						value={draft()}
						disabled={chat.state.isSending}
						onInput={event => setDraft(event.currentTarget.value)}
						onKeyDown={event => {
							// Enter sends, Shift+Enter breaks the line — what every chat does.
							if (event.key === 'Enter' && !event.shiftKey) {
								event.preventDefault()
								void submit()
							}
						}}
					/>
					<Button
						type="button"
						variant="secondary"
						size="sm"
						title={store.widget.state.text.chat.attachTitle}
						aria-label={store.widget.state.text.chat.attachTitle}
						onClick={() => {
							// Hand the page over to the drawing overlay; it comes back with a screenshot.
							chat.methods.close()
							store.widget.setState({ captureMode: 'chat', isOpen: true })
						}}
					>
						<ImageIcon size={18} />
					</Button>
					<Button
						type="submit"
						size="sm"
						title={store.widget.state.text.chat.sendButton}
						aria-label={store.widget.state.text.chat.sendButton}
						disabled={chat.state.isSending || (!draft().trim() && !chat.state.pendingScreenshot)}
					>
						<SendIcon size={18} />
					</Button>
				</form>
			</div>
		</Show>
	)
}
