import { type Component, For } from 'solid-js'
import { useEchoStore } from '~/contexts/EchoContext'

const COLORS = [
	'#ff0000', // Red
	'#00ff00', // Green
	'#0000ff', // Blue
	'#ffff00', // Yellow
	'#ff00ff', // Magenta
	'#00ffff', // Cyan
	'#ffa500', // Orange
	'#800080', // Purple
]

export const ColorSelector: Component = () => {
	const store = useEchoStore()

	return (
		<>
			<div class="echo-color-selector">
				<button
					class="echo-drawing-toolbar-button"
					data-selected={false}
					title="Color"
					style={{
						'background-color': store.drawing.selectedColor,
					}}
				/>
				<div class="echo-color-swatch-wrapper">
					<div class="echo-color-swatch">
						<For each={[store.widget.primaryColor, ...COLORS]}>
							{color => (
								<button
									onClick={() => store.setDrawing({ selectedColor: color })}
									class="echo-color-swatch-button"
									data-selected={store.drawing.selectedColor === color}
									title={`Select ${color} color`}
									style={{
										'background-color': color,
									}}
								/>
							)}
						</For>
					</div>
				</div>
			</div>
		</>
	)
}
