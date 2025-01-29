import { Component } from 'solid-js'
import { XIcon } from '~/components/icons'
import { useEchoStore } from '~/contexts/EchoContext'
import { welcomeMessageStore } from '~/stores/welcomeMessageStore'
import { getFromStorage, setToStorage } from '~/utils/storage'

export const WelcomeMessage: Component = () => {
	const store = useEchoStore()
	const hasSeenMessage = getFromStorage('welcome_message_shown', false)

	const hideMessage = (e: MouseEvent | KeyboardEvent) => {
		e.stopPropagation()
		welcomeMessageStore.setIsClosing(true)
		setToStorage('welcome_message_shown', true)
	}

	const openWidget = () => {
		store.setWidget({ isOpen: true })
		welcomeMessageStore.setIsClosing(true)
		setToStorage('welcome_message_shown', true)
	}

	if (hasSeenMessage) {
		return null
	}

	return (
		<button
			class="echo-welcome-message"
			data-hidden={welcomeMessageStore.isClosing()}
			onClick={openWidget}
			style={{
				bottom: '80px',
				right: '20px',
			}}
		>
			<span class="echo-welcome-message-pulsar" />
			{store.text.welcomeMessage.text}
			<div
				class="echo-welcome-message-close"
				onClick={hideMessage}
				role="button"
				tabindex="0"
				aria-label={store.text.welcomeMessage.closeAriaLabel}
				onKeyDown={e => e.key === 'Enter' && hideMessage(e)}
			>
				<XIcon size={16} strokeWidth={3} />
			</div>
		</button>
	)
}
