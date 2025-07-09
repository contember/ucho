import { type Component } from 'solid-js'
import { createEffect, createSignal } from 'solid-js'
import { ContemberIcon } from '~/components/icons'
import { useEchoStore } from '~/contexts/EchoContext'
import { getFromStorage, setToStorage } from '~/utils'
import { StoredFeedback } from './StoredFeedback'

export const LauncherButton: Component = () => {
	const store = useEchoStore()
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
			if (!store.widget.state.isOpen && !store.widget.state.isStoredFeedbackOpen && hasSeenMessage) {
				setIsMinimized(true)
			}
		}, 4000) // Hide after 4 seconds of inactivity
	}

	const handleEchoLauncherButtonEnter = () => {
		setIsMinimized(false)
	}

	const handleEchoLauncherButtonLeave = () => {
		resetHideTimeout()
	}

	const handleClick = (e: MouseEvent) => {
		store.widget.setState({ isOpen: !store.widget.state.isOpen })
		store.widget.setState({ welcomeMessageIsClosing: true })
		setToStorage('welcome_message_shown', true)
	}

	createEffect(() => {
		if (!store.widget.state.isOpen) {
			setIsMinimized(false)
			if (!store.widget.state.disableMinimization) {
				resetHideTimeout()
			}
		}
		if (store.widget.state.isStoredFeedbackOpen) {
			setIsMinimized(false)
		}
	})

	const handleCountClick = (e: MouseEvent) => {
		e.stopPropagation()
		store.widget.setState({ isStoredFeedbackOpen: !store.widget.state.isStoredFeedbackOpen })
		setIsMinimized(false)
	}

	return (
		<>
			<button
				class="echo-launcher-button"
				data-hidden={store.widget.state.isOpen}
				onClick={handleClick}
				onPointerEnter={handleEchoLauncherButtonEnter}
				onPointerLeave={handleEchoLauncherButtonLeave}
				style={{
					transform: `translateX(${isMinimized() ? '45px' : '0'})`,
				}}
				aria-label="Open feedback form"
				aria-expanded={store.widget.state.isOpen}
				role="button"
			>
				<ContemberIcon stroke="white" fill="#ffffff" aria-hidden="true" />
				{store.widget.state.pagesCount > 0 && (
					<span
						class="echo-launcher-button-count"
						onClick={handleCountClick}
						role="button"
						aria-label={`View ${store.widget.state.pagesCount} stored feedback items`}
						tabindex="0"
					>
						{store.widget.state.pagesCount}
					</span>
				)}
			</button>
			<StoredFeedback />
		</>
	)
}
