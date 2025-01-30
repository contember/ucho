import type { Component } from 'solid-js'
import { ContemberIcon } from '~/components/icons/ContemberIcon'
import { useEchoStore } from '~/contexts'
import { welcomeMessageStore } from '~/stores'
import { setToStorage } from '~/utils'
import { SavedPagesDropdown } from './SavedPagesDropdown'

export const EchoButton: Component = () => {
	const store = useEchoStore()

	const handleClick = () => {
		store.setWidget({ isOpen: !store.widget.isOpen })
		welcomeMessageStore.setIsClosing(true)
		setToStorage('welcome_message_shown', true)
	}

	const handleCountClick = (e: MouseEvent) => {
		e.stopPropagation()
		store.setWidget({ isPagesDropdownOpen: !store.widget.isPagesDropdownOpen })
	}

	return (
		<div class="echo-launcher-button-wrapper">
			<button class="echo-launcher-button" onClick={handleClick} data-hidden={store.widget.isOpen}>
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
