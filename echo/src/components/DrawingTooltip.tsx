import { Component, Show } from 'solid-js'
import { useRootStore } from '../contexts/RootContext'

export const DrawingTooltip: Component = () => {
	const store = useRootStore()

	return (
		<Show when={store.drawing.showTooltip && store.widget.isOpen}>
			<div
				class="echo-tooltip"
				style={{
					top: `${store.drawing.mousePosition.y + 20}px`,
					left: `${store.drawing.mousePosition.x + 10}px`,
					transform: 'none',
				}}
			>
				Click & drag to draw
			</div>
		</Show>
	)
}
