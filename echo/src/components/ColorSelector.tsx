import { Component, For } from 'solid-js'
import { useRootStore } from '~/contexts/RootContext'

const COLORS = [
	'#FF0000', // Red
	'#00FF00', // Green
	'#0000FF', // Blue
	'#FFFF00', // Yellow
	'#FF00FF', // Magenta
	'#00FFFF', // Cyan
	'#FFA500', // Orange
	'#800080', // Purple
]

export const ColorSelector: Component = () => {
	const store = useRootStore()

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
