import { Component } from 'solid-js'
import { CloseIcon } from '~/components/icons'
import { useRootStore } from '~/contexts/RootContext'
import { welcomeMessageStore } from '~/stores/welcomeMessageStore'
import { getFromStorage, setToStorage } from '~/utils/storage'

export const WelcomeMessage: Component = () => {
	const store = useRootStore()
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
			<div
				class="echo-welcome-message-close"
				onClick={hideMessage}
				role="button"
				tabindex="0"
				aria-label={store.text.welcomeMessage.closeAriaLabel}
				onKeyDown={e => e.key === 'Enter' && hideMessage(e)}
			>
				<CloseIcon size={16} stroke="currentColor" />
			</div>
			{store.text.welcomeMessage.text}
		</button>
	)
}
