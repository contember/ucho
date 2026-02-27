import { type Component, createMemo, Show } from 'solid-js'
import { useStore } from '~/contexts'
import { isMobileDevice } from '~/utils/device'

export const DrawingTooltip: Component = () => {
	const store = useStore()

	const showTooltip = createMemo(() => {
		return (
			store.drawing.state.showTooltip &&
			store.drawing.state.mousePosition.y &&
			store.drawing.state.mousePosition.x &&
			store.widget.state.isOpen &&
			!isMobileDevice()
		)
	})

	return (
		<Show when={showTooltip()}>
			<div
				class="ucho-drawing-tooltip"
				data-hide-when-drawing="true"
				style={{
					top: `${store.drawing.state.mousePosition.y + 20}px`,
					left: `${store.drawing.state.mousePosition.x + 10}px`,
				}}
			>
				{store.widget.state.text.drawingTooltip.text}
			</div>
		</Show>
	)
}
