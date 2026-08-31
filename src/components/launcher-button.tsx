import { type Component, createEffect, createSignal, onCleanup, Show } from 'solid-js'
import uchoIconPng from '~/assets/ucho-icon.png'
import { UchoIcon } from '~/components/icons'
import { useStore } from '~/contexts'
import { getFromStorage, setToStorage } from '~/utils'
import { ChatPanel } from './chat-panel'
import { StoredFeedback } from './stored-feedback'

export const LauncherButton: Component = () => {
	const store = useStore()
	const [isMinimized, setIsMinimized] = createSignal(false)
	let minimizeTimeout: number | undefined

	const resetHideTimeout = () => {
		if (minimizeTimeout) {
			window.clearTimeout(minimizeTimeout)
		}
		if (store.widget.state.disableMinimization) {
			return
		}
		minimizeTimeout = window.setTimeout(() => {
			const hasSeenMessage = getFromStorage('welcome_message_shown', false)
			// An unread answer must not tuck itself off-screen with the launcher —
			// the badge would be invisible exactly when it matters.
			const hasUnread = (store.chat?.state.unreadCount ?? 0) > 0
			if (
				!store.widget.state.isOpen && !store.widget.state.isStoredFeedbackOpen && !store.chat?.state.isOpen && !hasUnread && hasSeenMessage
			) {
				setIsMinimized(true)
			}
		}, 4000) // Hide after 4 seconds of inactivity
	}

	const handleUchoLauncherButtonEnter = () => {
		setIsMinimized(false)
	}

	const handleUchoLauncherButtonLeave = () => {
		resetHideTimeout()
	}

	const handleClick = (e: MouseEvent) => {
		store.widget.setState({ welcomeMessageIsClosing: true })
		setToStorage('welcome_message_shown', true)

		// With chat configured the launcher is the way into the conversation; the
		// feedback overlay is then reached from inside the panel. Without it, nothing
		// about this button changes.
		if (store.chat?.isAvailable()) {
			// The two popovers share the same slot and stacking level, so one must give way.
			store.widget.setState({ isStoredFeedbackOpen: false })
			store.chat.methods.toggle()
			return
		}

		store.widget.setState({ isOpen: !store.widget.state.isOpen })
	}

	createEffect(() => {
		// Tracked so a reply arriving after the launcher already tucked itself away pulls
		// it back into view — otherwise the badge renders off-screen and is never seen.
		const hasUnread = (store.chat?.state.unreadCount ?? 0) > 0
		if (hasUnread) {
			setIsMinimized(false)
			return
		}
		if (!store.widget.state.isOpen) {
			setIsMinimized(false)
			if (!store.widget.state.disableMinimization) {
				resetHideTimeout()
			}
		}
		if (store.widget.state.isStoredFeedbackOpen || store.chat?.state.isOpen) {
			setIsMinimized(false)
		}
	})

	onCleanup(() => {
		if (minimizeTimeout) {
			window.clearTimeout(minimizeTimeout)
		}
	})

	const handleCountClick = (e: MouseEvent) => {
		e.stopPropagation()
		store.chat?.methods.close()
		store.widget.setState({ isStoredFeedbackOpen: !store.widget.state.isStoredFeedbackOpen })
		setIsMinimized(false)
	}

	const isLeft = () => store.widget.state.position.includes('left')

	return (
		<>
			<div
				class="ucho-launcher-button-wrapper"
				onPointerEnter={handleUchoLauncherButtonEnter}
				onPointerLeave={handleUchoLauncherButtonLeave}
				style={{
					transform: `translateX(${isLeft() ? (isMinimized() ? '-45px' : '-22px') : (isMinimized() ? '45px' : '22px')})`,
				}}
			>
				<button
					class="ucho-launcher-button"
					data-hidden={store.widget.state.isOpen}
					onClick={handleClick}
					aria-label={store.chat ? store.widget.state.text.chat.openTitle : 'Open feedback form'}
					aria-expanded={store.chat ? store.chat.state.isOpen : store.widget.state.isOpen}
				>
					<Show when={store.widget.state.fancyIcon} fallback={<UchoIcon size={52} style={{ transform: isLeft() ? 'scaleX(-1)' : undefined }} />}>
						<img src={uchoIconPng} alt="ucho icon" aria-hidden="true" width={52} height={72} style={{ transform: isLeft() ? 'scaleX(-1)' : undefined }} />
					</Show>
				</button>
				<Show when={(store.chat?.state.unreadCount ?? 0) > 0}>
					<span
						class="ucho-launcher-button-unread"
						aria-label={`${store.chat?.state.unreadCount} ${store.widget.state.text.chat.unreadLabel}`}
						style={isLeft() ? { right: 'auto', left: 'calc(-1 * var(--spacing-xs))' } : undefined}
					>
						{store.chat?.state.unreadCount}
					</span>
				</Show>
				{store.methods.hasFeedback() && store.widget.state.pagesCount > 0 && (
					<button
						class="ucho-launcher-button-count"
						onClick={handleCountClick}
						aria-label={`View ${store.widget.state.pagesCount} stored feedback items`}
						style={isLeft() ? { left: 'auto', right: 'calc(-1 * var(--spacing-xs))' } : undefined}
					>
						{store.widget.state.pagesCount}
					</button>
				)}
			</div>
			<StoredFeedback />
			<ChatPanel />
		</>
	)
}
