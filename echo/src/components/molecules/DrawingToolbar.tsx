import { type Component, For } from 'solid-js'
import { HighlightIcon, PenIcon, TrashIcon } from '~/components/icons'
import { toolConfig } from '~/config/drawingConfig'
import { useEchoStore } from '~/contexts/EchoContext'
import type { IconProps } from '~/types'
import { ColorSelector } from './ColorSelector'

const ToolIcon: Record<string, Component<IconProps>> = {
	rectangle: HighlightIcon,
	path: PenIcon,
}

export const DrawingToolbar: Component = () => {
	const store = useEchoStore()
	const tools = Object.values(toolConfig)

	return (
		<div class="echo-drawing-toolbar" data-hide-when-drawing="true">
			<For each={tools}>
				{tool => {
					const Icon = ToolIcon[tool.id]
					return (
						<button
							class="echo-drawing-toolbar-button"
							title={tool.label}
							data-selected={store.drawing.state.selectedTool === tool.id}
							onClick={() => store.drawing.setState({ selectedTool: tool.id })}
						>
							<Icon class="echo-drawing-toolbar-icon" />
						</button>
					)
				}}
			</For>
			<ColorSelector />
			{/* TODO: Add a confirmation dialog */}
			<button class="echo-drawing-toolbar-button" title="Clear drawings" onClick={() => store.drawing.setState({ shapes: [] }, true)}>
				<TrashIcon class="echo-drawing-toolbar-icon" />
			</button>
		</div>
	)
}
