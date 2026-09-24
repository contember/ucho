import { type Component, createEffect, createSignal, For, onCleanup, onMount, Show } from 'solid-js'
import { Button } from '~/components/button'
import { ChevronLeftIcon, ImageIcon, MaximizeIcon, MinimizeIcon, SendIcon, XIcon } from '~/components/icons'
import { useStore } from '~/contexts'
import type { ChatAttachment, ChatMessage } from '~/types'
import { registerWindowEventListener } from '~/utils/listeners'
import { safeMediaUrl } from '~/utils/url'

/** Only images are worth showing inline; anything else is offered as a link. */
const isImage = (attachment: ChatAttachment): boolean => (
	attachment.fileType ? attachment.fileType.startsWith('image/') : /\.(png|jpe?g|webp|gif|avif)$/i.test(attachment.url)
)

const formatTime = (createdAt: string): string => {
	const date = new Date(createdAt)
	if (Number.isNaN(date.getTime())) return ''
	return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
}

/** How close to the end of the transcript still counts as following it. */
const FOLLOW_SLACK = 32

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

	// Whether the reader is at the end of the transcript. Kept from the scroll events, because
	// by the time a new message is in the DOM the list has already grown under them.
	let isFollowing = true
	// Every message already placed on screen since the panel opened. Null until the first
	// placement, and cleared on close, so reopening lands afresh.
	let placed: Set<string> | null = null
	// The answer the view was last landed on (null for the end), and where that left it.
	// Heights change after landing, when screenshots load or the list is resized, and the
	// landing is redone for as long as the reader has not moved away from it.
	let target: string | null = null
	let settledTop: number | undefined

	const scrollToEnd = () => {
		if (!listRef) return
		listRef.scrollTo({ top: listRef.scrollHeight })
		settledTop = listRef.scrollTop
	}

	/**
	 * Lands on an answer by its first line when it is taller than the list, and on the end
	 * of the transcript when it fits. Scrolling to the end alone would show a long answer by
	 * its last lines, and the reader would have to scroll back up to find where it starts.
	 */
	const landOn = (id: string | null) => {
		if (!listRef) return
		// Kept even when the answer fits and the view goes to the end: a screenshot in it
		// may still be loading, and once it has, the same answer may no longer fit.
		target = id
		const node = id && listRef.querySelector<HTMLElement>(`[data-message-id="${CSS.escape(id)}"]`)
		if (!node) return scrollToEnd()

		const top = node.getBoundingClientRect().top - listRef.getBoundingClientRect().top + listRef.scrollTop
		const padding = Number.parseFloat(getComputedStyle(listRef).paddingTop) || 0
		if (listRef.scrollHeight - top <= listRef.clientHeight) return scrollToEnd()

		listRef.scrollTo({ top: top - padding })
		settledTop = listRef.scrollTop
	}

	// Called when the list's content or size changes without a new message: a screenshot
	// finished loading, the composer grew, the panel was enlarged.
	const resettle = () => {
		if (!listRef) return
		const isUntouched = settledTop !== undefined && Math.abs(listRef.scrollTop - settledTop) <= 1
		if (isUntouched) landOn(target)
		else if (isFollowing) landOn(null)
	}

	const attachList = (element: HTMLDivElement) => {
		listRef = element
		const observer = new ResizeObserver(resettle)
		observer.observe(element)
		// `load` does not bubble, but it can be caught on the way down.
		element.addEventListener('load', resettle, true)
		onCleanup(() => {
			observer.disconnect()
			element.removeEventListener('load', resettle, true)
		})
	}

	createEffect(() => {
		const messages = chat.state.messages
		const ids = messages.map(message => message.id)
		if (!chat.state.isOpen) {
			placed = null
			target = null
			settledTop = undefined
			isFollowing = true
			return
		}
		// Nothing is placed while the list shows the loading state: the messages are not in
		// the DOM yet, and history that arrives later has to be landed on, not skipped.
		if (chat.state.isLoading || ids.length === 0) return

		if (placed === null) {
			placed = new Set(ids)
			// Opening goes to what the user has not read yet. With nothing unread, the newest
			// answer is still worth seeing from its start if it is the last thing said.
			const newest = messages[messages.length - 1]
			const firstUnread = chat.state.firstUnreadId
			const destination = firstUnread && placed.has(firstUnread)
				? firstUnread
				: newest && !newest.author.isCustomer
				? newest.id
				: null
			queueMicrotask(() => landOn(destination))
			return
		}

		const fresh = messages.filter(message => !placed!.has(message.id))
		if (fresh.length === 0) return
		for (const message of fresh) placed.add(message.id)

		queueMicrotask(() => {
			// The user's own message is what they just did, and it is shown even when an
			// automatic reply came back in the same batch.
			if (fresh.some(message => message.author.isCustomer)) return landOn(null)
			// Somebody scrolled up to reread something is not dragged away from it.
			if (!isFollowing) return
			landOn(fresh.find(message => !message.author.isCustomer)?.id ?? null)
		})
	})

	// The composer grows with the draft up to the cap in the stylesheet and scrolls past it.
	// A pasted page of text in a one-line box cannot be read back before it is sent.
	const fitComposer = () => {
		if (!inputRef) return
		inputRef.style.height = 'auto'
		const border = inputRef.offsetHeight - inputRef.clientHeight
		inputRef.style.height = `${inputRef.scrollHeight + border}px`
	}

	createEffect(() => {
		// Read for tracking: the draft changes the content, the panel's size changes the
		// line length, and reopening mounts a fresh textarea for a draft that survived.
		draft()
		chat.state.isExpanded
		if (chat.state.isOpen) queueMicrotask(fitComposer)
	})

	createEffect(() => {
		if (chat.state.isOpen) queueMicrotask(() => inputRef?.focus())
	})

	registerWindowEventListener({
		event: 'keydown',
		callback: (event: KeyboardEvent) => {
			if (event.key !== 'Escape') return
			// The screenshot viewer is a modal dialog and takes Escape for itself. Without
			// this the one keypress would dismiss the panel behind it as well, and closing an
			// image would cost the user the conversation.
			if (chat.state.viewedImage) return
			if (chat.state.isOpen) chat.methods.close()
		},
	})

	// Without the signpost the launcher routes exclusively into chat, so this is the only
	// remaining way into the feedback form. It has to stay reachable from a full
	// conversation, not just from the empty state.
	const openFeedback = () => {
		chat.methods.close()
		store.widget.setState({ isOpen: true })
	}

	const backToMenu = () => {
		chat.methods.close()
		store.widget.setState({ isMenuOpen: true })
	}

	const submit = async () => {
		const text = draft().trim()
		if (!text && !chat.state.pendingScreenshot) return

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
		<Show when={chat.isAvailable() && chat.state.isOpen}>
			<div
				class="ucho-popover ucho-chat"
				data-expanded={chat.state.isExpanded}
				role="dialog"
				aria-label={store.widget.state.text.chat.title}
			>
				<div class="ucho-chat-header">
					<Show when={store.methods.hasMenu()}>
						<Button
							variant="secondary"
							size="sm"
							title={store.widget.state.text.menu.backTitle}
							aria-label={store.widget.state.text.menu.backTitle}
							onClick={backToMenu}
						>
							<ChevronLeftIcon size={18} />
						</Button>
					</Show>
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
						title={chat.state.isExpanded ? store.widget.state.text.chat.shrinkPanelTitle : store.widget.state.text.chat.expandPanelTitle}
						aria-label={chat.state.isExpanded ? store.widget.state.text.chat.shrinkPanelTitle : store.widget.state.text.chat.expandPanelTitle}
						aria-pressed={chat.state.isExpanded}
						onClick={() => chat.methods.toggleExpanded()}
					>
						<Show when={chat.state.isExpanded} fallback={<MaximizeIcon size={16} />}>
							<MinimizeIcon size={16} />
						</Show>
					</Button>
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

				<div
					class="ucho-chat-messages"
					ref={attachList}
					onScroll={event => {
						const list = event.currentTarget
						isFollowing = list.scrollHeight - list.scrollTop - list.clientHeight <= FOLLOW_SLACK
					}}
				>
					<Show when={!chat.state.isLoading} fallback={<p class="ucho-chat-empty">{store.widget.state.text.chat.loading}</p>}>
						<Show
							when={chat.state.messages.length > 0}
							fallback={
								<div class="ucho-chat-empty">
									<p>{store.widget.state.text.chat.emptyState}</p>
									<Show when={store.methods.hasFeedback()}>
										<Button
											class="ucho-chat-empty-action"
											variant="secondary"
											size="sm"
											onClick={openFeedback}
										>
											{store.widget.state.text.chat.feedbackLink}
										</Button>
									</Show>
								</div>
							}
						>
							<For each={chat.state.messages}>
								{(message: ChatMessage) => (
									<div class="ucho-chat-message" data-message-id={message.id} data-customer={message.author.isCustomer}>
										<div class="ucho-chat-bubble">
											<Show when={!message.author.isCustomer}>
												<span class="ucho-chat-author">{message.author.name}</span>
											</Show>
											<Show when={message.text}>
												<p class="ucho-chat-text">{message.text}</p>
											</Show>
											<For each={message.attachments}>
												{(attachment: ChatAttachment) => {
													// The adapter is host-supplied and its URLs come from a backend, so
													// they are input. An unsafe one renders as a plain filename rather
													// than a link nobody should click.
													const href = safeMediaUrl(attachment.url)
													const label = () => attachment.fileName ?? store.widget.state.text.chat.attachmentLabel

													return (
														<Show when={href} fallback={<span class="ucho-chat-file">{label()}</span>}>
															<Show
																when={isImage(attachment)}
																fallback={
																	<a class="ucho-chat-file" href={href!} target="_blank" rel="noreferrer noopener">
																		{label()}
																	</a>
																}
															>
																<a
																	class="ucho-chat-shot-link"
																	href={href!}
																	target="_blank"
																	rel="noreferrer noopener"
																	title={store.widget.state.text.chat.expandTitle}
																	onClick={event => {
																		// A modifier or middle click belongs to the browser: a new tab, a new
																		// window, a download. Only a plain click meant "show me this bigger",
																		// and the href is what makes the other three work at all.
																		if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return
																		event.preventDefault()
																		chat.methods.viewImage({ url: href!, label: label() })
																	}}
																>
																	<img class="ucho-chat-shot" src={href!} alt={label()} />
																</a>
															</Show>
														</Show>
													)
												}}
											</For>
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
