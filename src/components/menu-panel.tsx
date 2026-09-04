import { type Component, createEffect, Show } from 'solid-js'
import { Button } from '~/components/button'
import { ChevronRightIcon, MegaphoneIcon, MessageIcon, XIcon } from '~/components/icons'
import { useStore } from '~/contexts'
import { registerWindowEventListener } from '~/utils/listeners'

/**
 * The signpost. Chat and feedback are different promises — one gets you an answer, the
 * other gets a problem on record — and when both are on offer neither can be the one the
 * launcher silently picks. Rendered only in that case: with a single route configured the
 * launcher opens it directly and this never appears.
 *
 * The icons carry that same distinction: a speech bubble for the route where someone
 * answers you, a megaphone for the one where you are telling them something. A writing
 * tool would say only "type here", which is true of both.
 */
export const MenuPanel: Component = () => {
	const store = useStore()
	let panelRef: HTMLDivElement | undefined

	const text = () => store.widget.state.text.menu
	const isOpen = () => store.methods.hasMenu() && store.widget.state.isMenuOpen
	const unreadCount = () => store.chat?.state.unreadCount ?? 0

	const close = () => store.widget.setState({ isMenuOpen: false })

	const openChat = () => {
		close()
		store.chat?.methods.open()
	}

	const openFeedback = () => {
		close()
		store.widget.setState({ isOpen: true })
	}

	// Response times are the whole reason someone picks chat over a form, so they are
	// worth knowing before the choice rather than after it.
	createEffect(() => {
		if (isOpen()) void store.chat?.methods.loadAvailability()
	})

	registerWindowEventListener({
		event: 'keydown',
		callback: (event: KeyboardEvent) => {
			if (event.key === 'Escape' && isOpen()) close()
		},
	})

	// `pointerdown`, not `click`: the buttons that open this menu — the launcher, the
	// chat panel's back arrow — open it on `click`, and a click listener would then see
	// its own opening click as an outside one and shut the menu again immediately.
	registerWindowEventListener({
		event: 'pointerdown',
		callback: (event: PointerEvent) => {
			if (!isOpen() || !panelRef) return

			const path = event.composedPath()
			if (path.includes(panelRef)) return
			// The launcher toggles the menu itself. Closing here as well would make its
			// click cancel its own effect, and the button would look dead.
			if (path.some(node => node instanceof HTMLElement && node.classList.contains('ucho-launcher-button-wrapper'))) return

			close()
		},
	})

	return (
		<Show when={isOpen()}>
			<div class="ucho-popover ucho-menu" role="dialog" aria-label={text().title} ref={panelRef}>
				<div class="ucho-menu-header">
					<h3>{text().title}</h3>
					<Button
						variant="secondary"
						size="sm"
						title={text().closeTitle}
						aria-label={text().closeTitle}
						onClick={close}
					>
						<XIcon size={18} />
					</Button>
				</div>

				<div class="ucho-menu-options">
					<button type="button" class="ucho-menu-option" onClick={openChat}>
						<span class="ucho-menu-option-icon">
							<MessageIcon size={20} />
						</span>
						<span class="ucho-menu-option-body">
							<span class="ucho-menu-option-title">
								{text().chatTitle}
								<Show when={unreadCount() > 0}>
									<span class="ucho-menu-option-badge">{unreadCount()}</span>
								</Show>
							</span>
							<span class="ucho-menu-option-description">{text().chatDescription}</span>
							<Show when={store.chat?.state.availability?.message}>
								<span class="ucho-chat-availability" data-state={store.chat?.state.availability?.state}>
									{store.chat?.state.availability?.message}
								</span>
							</Show>
						</span>
						<ChevronRightIcon size={18} class="ucho-menu-option-chevron" />
					</button>

					<button type="button" class="ucho-menu-option" onClick={openFeedback}>
						<span class="ucho-menu-option-icon">
							<MegaphoneIcon size={20} />
						</span>
						<span class="ucho-menu-option-body">
							<span class="ucho-menu-option-title">{text().feedbackTitle}</span>
							<span class="ucho-menu-option-description">{text().feedbackDescription}</span>
						</span>
						<ChevronRightIcon size={18} class="ucho-menu-option-chevron" />
					</button>
				</div>
			</div>
		</Show>
	)
}
