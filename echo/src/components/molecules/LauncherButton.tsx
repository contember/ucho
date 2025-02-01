import type { Component } from 'solid-js'
import { createEffect, createSignal } from 'solid-js'
import { ContemberIcon } from '~/components/icons/ContemberIcon'
import { useEchoStore } from '~/contexts'
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

	const handleClick = () => {
		store.widget.setState({ isOpen: !store.widget.state.isOpen })
		store.widget.setState({ welcomeMessageIsClosing: true })
		setToStorage('welcome_message_shown', true)
	}

	createEffect(() => {
		if (!store.widget.state.isOpen) {
			setIsMinimized(false)
			resetHideTimeout()
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
					left: isMinimized() ? '45px' : '0',
				}}
			>
				<ContemberIcon stroke="white" fill="#ffffff" />
				{store.widget.state.pagesCount > 0 && (
					<span class="echo-launcher-button-count" onClick={handleCountClick}>
						{store.widget.state.pagesCount}
					</span>
				)}
			</button>
			<StoredFeedback />
		</>
	)
}
