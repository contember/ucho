import { Component } from 'solid-js'
import { useRootStore } from '../contexts/RootContext'
import { CloseIcon } from './icons'
import { ContemberIcon } from './icons/ContemberIcon'

export const WidgetButton: Component = () => {
	const store = useRootStore()

	return (
		<button onClick={() => store.setWidget({ isOpen: !store.widget.isOpen })} class="echo-widget-button" data-hidden={store.drawing.isDrawing}>
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
