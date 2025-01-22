import { Component } from 'solid-js'
import { useRootStore } from '../contexts/RootContext'
import { welcomeMessageStore } from '../stores/welcomeMessageStore'
import { setToStorage } from '../utils/storage'
import { CloseIcon } from './icons'
import { ContemberIcon } from './icons/ContemberIcon'

export const WidgetButton: Component = () => {
	const store = useRootStore()

	const handleClick = () => {
		store.setWidget({ isOpen: !store.widget.isOpen })
		welcomeMessageStore.setIsClosing(true)
		setToStorage('welcome_message_shown', true)
	}

	return (
		<button onClick={handleClick} class="echo-widget-button" data-hidden={store.drawing.isDrawing}>
			<ContemberIcon
				stroke="white"
				fill="#ffffff"
				style={{
					transition: 'opacity 0.2s ease',
					opacity: store.widget.isOpen ? '0' : '1',
				}}
			/>
			<CloseIcon
				stroke="white"
				style={{
					transition: 'opacity 0.2s ease',
					opacity: store.widget.isOpen ? '1' : '0',
					position: 'absolute',
				}}
			/>
		</button>
	)
}
