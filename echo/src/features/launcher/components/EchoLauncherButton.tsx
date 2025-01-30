import type { Component } from 'solid-js'
import { createEffect, createSignal } from 'solid-js'
import { ContemberIcon } from '~/components/icons/ContemberIcon'
import { useEchoStore } from '~/contexts'
import { welcomeMessageStore } from '~/stores'
import { setToStorage } from '~/utils'
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
			if (!store.widget.isOpen) {
				setIsMinimized(true)
			}
		}, 3000) // Hide after 3 seconds of inactivity
	}

	const handleEchoLauncherButtonEnter = () => {
		setIsMinimized(false)
	}

	const handleEchoLauncherButtonLeave = () => {
		resetHideTimeout()
	}

	const handleClick = () => {
		store.setWidget({ isOpen: !store.widget.isOpen })
		welcomeMessageStore.setIsClosing(true)
		setToStorage('welcome_message_shown', true)
	}

	createEffect(() => {
		if (!store.widget.isOpen) {
			setIsMinimized(false)
			resetHideTimeout()
		}
	})

	const handleCountClick = (e: MouseEvent) => {
		e.stopPropagation()
		store.setWidget({ isPagesDropdownOpen: !store.widget.isPagesDropdownOpen })
		setIsMinimized(false)
	}

	return (
		<div class="echo-launcher-button-wrapper">
			<button
				class="echo-launcher-button"
				style={{
					// left: isMinimized() ? '45px' : '0',
					top: isMinimized() ? '45px' : '0',
					opacity: isMinimized() ? '0.6' : '1',
				}}
				onPointerEnter={handleEchoLauncherButtonEnter}
				onPointerLeave={handleEchoLauncherButtonLeave}
				onClick={handleClick}
				data-hidden={store.widget.isOpen}
			>
				<ContemberIcon stroke="white" fill="#ffffff" />
				{store.widget.pagesCount > 0 && (
					<span class="echo-launcher-button-count" onClick={handleCountClick}>
						{store.widget.pagesCount}
					</span>
				)}
			</button>
			<SavedPagesDropdown />
		</div>
	)
}
