import { type Component, createEffect, createSignal, onCleanup } from 'solid-js'
import uchoIcon from '~/assets/ucho-icon.png'
import { useStore } from '~/contexts'
import { getFromStorage, setToStorage } from '~/utils'
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
			if (!store.widget.state.isOpen && !store.widget.state.isStoredFeedbackOpen && hasSeenMessage) {
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

	onCleanup(() => {
		if (minimizeTimeout) {
			window.clearTimeout(minimizeTimeout)
		}
	})

	const handleCountClick = (e: MouseEvent) => {
		e.stopPropagation()
		store.widget.setState({ isStoredFeedbackOpen: !store.widget.state.isStoredFeedbackOpen })
		setIsMinimized(false)
	}

	return (
		<>
			<div
				class="ucho-launcher-button-wrapper"
				onPointerEnter={handleUchoLauncherButtonEnter}
				onPointerLeave={handleUchoLauncherButtonLeave}
				style={{
					transform: `translateX(${isMinimized() ? '55px' : '34px'})`,
				}}
			>
				<button
					class="ucho-launcher-button"
					data-hidden={store.widget.state.isOpen}
					onClick={handleClick}
					aria-label="Open feedback form"
					aria-expanded={store.widget.state.isOpen}
				>
					<img src={uchoIcon} alt="" aria-hidden="true" width={72} height={72} />
				</button>
				{store.widget.state.pagesCount > 0 && (
					<button
						class="ucho-launcher-button-count"
						onClick={handleCountClick}
						aria-label={`View ${store.widget.state.pagesCount} stored feedback items`}
					>
						{store.widget.state.pagesCount}
					</button>
				)}
			</div>
			<StoredFeedback />
		</>
	)
}
