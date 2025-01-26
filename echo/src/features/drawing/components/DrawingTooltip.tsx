import { Component, Show } from 'solid-js'
import { useEchoStore } from '~/contexts'
import { isMobileDevice } from '~/utils/device'

export const DrawingTooltip: Component = () => {
	const store = useEchoStore()

	return (
		<Show when={store.drawing.showTooltip && store.widget.isOpen && !isMobileDevice()}>
			<div
				class="echo-drawing-tooltip"
				data-hide-when-drawing="true"
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
