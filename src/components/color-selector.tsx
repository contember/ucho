import { type Component, For } from 'solid-js'
import { useStore } from '~/contexts'

const COLORS = [
	'#ff6b6b', // Soft Red
	'#69db7c', // Soft Green
	'#74c0fc', // Soft Blue
	'#ffd43b', // Soft Yellow
	'#da77f2', // Soft Purple
	'#66d9e8', // Soft Cyan
	'#ffa94d', // Soft Orange
	'#e599f7', // Soft Pink
] as const

type ColorCode = (typeof COLORS)[number]

const COLOR_NAMES: Record<ColorCode, string> = {
	'#ff6b6b': 'Soft Red',
	'#69db7c': 'Soft Green',
	'#74c0fc': 'Soft Blue',
	'#ffd43b': 'Soft Yellow',
	'#da77f2': 'Soft Purple',
	'#66d9e8': 'Soft Cyan',
	'#ffa94d': 'Soft Orange',
	'#e599f7': 'Soft Pink',
}

const getColorName = (color: string): string => {
	return (COLOR_NAMES as Record<string, string>)[color] || 'Primary'
}

export const ColorSelector: Component = () => {
	const store = useStore()

	return (
		<div class="ucho-color-selector" role="group" aria-label="Color Selection">
			<button
				class="ucho-drawing-toolbar-button"
				title="Current Color"
				aria-label={`Current color: ${getColorName(store.drawing.state.selectedColor)}`}
				aria-expanded={false}
				style={{
					'background-color': store.drawing.state.selectedColor,
				}}
			/>
			<div class="ucho-color-swatch-wrapper" role="listbox" aria-label="Available Colors">
				<div class="ucho-color-swatch">
					<For each={[store.widget.state.primaryColor, ...COLORS]}>
						{color => (
							<button
								class="ucho-color-swatch-button"
								title={`Select ${getColorName(color)} color`}
								data-selected={store.drawing.state.selectedColor === color}
								onClick={() => store.drawing.setState({ selectedColor: color })}
								style={{
									'background-color': color,
								}}
								role="option"
								aria-label={`${getColorName(color)} color`}
								aria-selected={store.drawing.state.selectedColor === color}
							/>
						)}
					</For>
				</div>
			</div>
		</div>
	)
}
