import { type Component, For } from 'solid-js'
import { HighlightIcon, PenIcon } from '~/components/icons'
import { drawingConfig } from '~/config/drawingConfig'
import { useEchoStore } from '~/contexts/EchoContext'
import type { IconProps } from '~/types'
import { ColorSelector } from './ColorSelector'

const ToolIcon: Record<string, Component<IconProps>> = {
	rectangle: HighlightIcon,
	path: PenIcon,
}

export const DrawingToolbar: Component = () => {
	const store = useEchoStore()
	const tools = Object.values(drawingConfig)

	return (
		<div class="echo-drawing-toolbar" data-hide-when-drawing="true">
			<For each={tools}>
				{tool => {
					const Icon = ToolIcon[tool.id]
					return (
						<button
							onClick={() => store.drawing.setState({ selectedTool: tool.id })}
							class="echo-drawing-toolbar-button"
							data-selected={store.drawing.state.selectedTool === tool.id}
							title={tool.label}
						>
							<Icon class="echo-drawing-toolbar-icon" />
						</button>
					)
				}}
			</For>
			<ColorSelector />
		</div>
	)
}
