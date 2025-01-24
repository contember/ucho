import { Component } from 'solid-js'
import { ContemberIcon } from '~/components/icons/ContemberIcon'
import { useRootStore } from '~/contexts'
import { welcomeMessageStore } from '~/stores'
import { setToStorage } from '~/utils'

export const WidgetButton: Component = () => {
	const store = useRootStore()

	const handleClick = () => {
		store.setWidget({ isOpen: !store.widget.isOpen })
		welcomeMessageStore.setIsClosing(true)
		setToStorage('welcome_message_shown', true)
	}

	return (
		<button onClick={handleClick} class="echo-widget-button" data-hidden={store.drawing.isDrawing || store.widget.isOpen}>
			<ContemberIcon
				stroke="white"
				fill="#ffffff"
				style={{
					transition: 'opacity 0.2s ease',
					opacity: store.widget.isOpen ? '0' : '1',
				}}
			/>
		</button>
	)
}
