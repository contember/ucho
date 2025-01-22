import { Component } from 'solid-js'
import { welcomeMessageStore } from '../stores/welcomeMessageStore'
import { getFromStorage, setToStorage } from '../utils/storage'
import { CloseIcon } from './icons'

export const WelcomeMessage: Component = () => {
	const hasSeenMessage = getFromStorage('welcome_message_shown', false)

	const hideMessage = () => {
		welcomeMessageStore.setIsClosing(true)
		setToStorage('welcome_message_shown', true)
	}

	if (hasSeenMessage) {
		return null
	}

	return (
		<div
			class="echo-welcome-message"
			data-hidden={welcomeMessageStore.isClosing()}
			style={{
				bottom: '80px',
				right: '20px',
			}}
		>
			<button class="echo-welcome-message-close" onClick={hideMessage} aria-label="Close welcome message">
				<CloseIcon size={16} stroke="currentColor" />
			</button>
			Click here to leave feedback
		</div>
	)
}
