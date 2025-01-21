import { Component, Show } from 'solid-js'
import { useDrawing } from '../contexts/DrawingContext'
import { useWidget } from '../contexts/WidgetContext'

export const DrawingTooltip: Component = () => {
	const { isOpenStaggered } = useWidget()
	const {
		state: { showTooltip, mousePosition },
	} = useDrawing()

	return (
		<Show when={showTooltip() && isOpenStaggered()}>
			<div
				class="echo-tooltip"
				style={{
					top: `${mousePosition().y + 20}px`,
					left: `${mousePosition().x + 10}px`,
					transform: 'none',
				}}
			>
				Click & drag to draw
			</div>
		</Show>
	)
}
