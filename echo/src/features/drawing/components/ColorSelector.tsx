import { type Component, For } from 'solid-js'
import { useEchoStore } from '~/contexts/EchoContext'

const COLORS = [
	'#ff6b6b', // Soft Red
	'#69db7c', // Soft Green
	'#74c0fc', // Soft Blue
	'#ffd43b', // Soft Yellow
	'#da77f2', // Soft Purple
	'#66d9e8', // Soft Cyan
	'#ffa94d', // Soft Orange
	'#e599f7', // Soft Pink
]

export const ColorSelector: Component = () => {
	const store = useEchoStore()

	return (
		<>
			<div class="echo-color-selector">
				<button
					class="echo-drawing-toolbar-button"
					title="Color"
					style={{
						'background-color': store.drawing.state.selectedColor,
					}}
				/>
				<div class="echo-color-swatch-wrapper">
					<div class="echo-color-swatch">
						<For each={[store.widget.state.primaryColor, ...COLORS]}>
							{color => (
								<button
									onClick={() => store.drawing.setState({ selectedColor: color })}
									class="echo-color-swatch-button"
									data-selected={store.drawing.state.selectedColor === color}
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
