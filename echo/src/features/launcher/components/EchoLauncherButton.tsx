import type { Component } from 'solid-js'
import { createEffect, createSignal } from 'solid-js'
import { ContemberIcon } from '~/components/icons/ContemberIcon'
import { useEchoStore } from '~/contexts'
import { getFromStorage, setToStorage } from '~/utils'
import { SavedPagesDropdown } from './SavedPagesDropdown'

export const EchoLauncherButton: Component = () => {
	const store = useEchoStore()
	const [isMinimized, setIsMinimized] = createSignal(false)
	let minimizeTimeout: number | undefined

	const resetHideTimeout = () => {
		if (minimizeTimeout) {
			window.clearTimeout(minimizeTimeout)
		}
		minimizeTimeout = window.setTimeout(() => {
			const hasSeenMessage = getFromStorage('welcome_message_shown', false)
			if (!store.widget.state.isOpen && hasSeenMessage) {
				setIsMinimized(true)
			}
		}, 5000) // Hide after 5 seconds of inactivity
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
	})

	const handleCountClick = (e: MouseEvent) => {
		e.stopPropagation()
		store.widget.setState({ isPagesDropdownOpen: !store.widget.state.isPagesDropdownOpen })
		setIsMinimized(false)
	}

	return (
		<div class="echo-launcher-button-wrapper">
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
			<SavedPagesDropdown />
		</div>
	)
}
