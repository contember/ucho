import type { Component } from 'solid-js'
import { XIcon } from '~/components/icons'
import { useStore } from '~/contexts'
import type { Position } from '~/types'
import { getFromStorage, setToStorage } from '~/utils/storage'

const getWelcomeMessagePosition = (position: Position): Record<string, string> => {
	const isTop = position.includes('top')
	const isLeft = position.includes('left')
	return {
		...(isTop ? { top: '80px' } : { bottom: '80px' }),
		...(isLeft ? { left: '20px' } : { right: '20px' }),
	}
}

export const WelcomeMessage: Component = () => {
	const store = useStore()
	const hasSeenMessage = getFromStorage('welcome_message_shown', false)

	const hideMessage = (e: MouseEvent | KeyboardEvent) => {
		e.stopPropagation()
		store.widget.setState({ welcomeMessageIsClosing: true })
		setToStorage('welcome_message_shown', true)
	}

	const openWidget = () => {
		store.widget.setState({ isOpen: true })
		store.widget.setState({ welcomeMessageIsClosing: true })
		setToStorage('welcome_message_shown', true)
	}

	if (hasSeenMessage) {
		return null
	}

	return (
		<button
			class="ucho-welcome-message"
			data-hidden={store.widget.state.welcomeMessageIsClosing}
			onClick={openWidget}
			style={getWelcomeMessagePosition(store.widget.state.position)}
		>
			<span class="ucho-welcome-message-pulsar" />
			{store.widget.state.text.welcomeMessage.text}
			<div
				class="ucho-welcome-message-close"
				onClick={hideMessage}
				role="button"
				tabindex="0"
				aria-label={store.widget.state.text.welcomeMessage.closeAriaLabel}
				onKeyDown={e => e.key === 'Enter' && hideMessage(e)}
			>
				<XIcon size={16} strokeWidth={3} />
			</div>
		</button>
	)
}
