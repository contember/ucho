import { Component } from 'solid-js'
import { ContemberIcon } from '~/components/icons/ContemberIcon'
import { useEchoStore } from '~/contexts'
import { welcomeMessageStore } from '~/stores'
import { setToStorage } from '~/utils'

export const EchoButton: Component = () => {
	const store = useEchoStore()

	const handleClick = () => {
		store.setWidget({ isOpen: !store.widget.isOpen })
		welcomeMessageStore.setIsClosing(true)
		setToStorage('welcome_message_shown', true)
	}

	return (
		<button class="echo-button" onClick={handleClick} data-hidden={store.widget.isOpen}>
			<ContemberIcon stroke="white" fill="#ffffff" />
		</button>
	)
}
