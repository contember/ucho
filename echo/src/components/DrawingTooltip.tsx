import { Component, Show } from 'solid-js'
import { useRootStore } from '../contexts/RootContext'
import { isMobileDevice } from '../utils/device'

export const DrawingTooltip: Component = () => {
	const store = useRootStore()

	return (
		<Show when={store.drawing.showTooltip && store.widget.isOpen && !isMobileDevice()}>
			<div
				class="echo-tooltip"
				style={{
					top: `${store.drawing.mousePosition.y + 20}px`,
					left: `${store.drawing.mousePosition.x + 10}px`,
					transform: 'none',
				}}
			>
				{store.text.drawingTooltip.text}
			</div>
		</Show>
	)
}
