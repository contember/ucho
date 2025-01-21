import { Component, For } from 'solid-js'
import { config } from '../config'
import { useDrawing } from '../contexts/DrawingContext'
import { IconProps } from '../types'
import { HighlightIcon, PenIcon } from './icons'

// Map of tool IDs to their respective icon components
const ToolIcon: Record<string, Component<IconProps>> = {
	highlight: HighlightIcon,
	pen: PenIcon,
}

export const DrawingToolbar: Component = () => {
	const {
		state: { selectedTool, setSelectedTool },
	} = useDrawing()

	const tools = Object.values(config)

	return (
		<div class="echo-drawing-toolbar">
			<For each={tools}>
				{tool => {
					const Icon = ToolIcon[tool.id]
					return (
						<button
							onClick={() => setSelectedTool(tool.id)}
							class="echo-drawing-toolbar-button"
							data-selected={selectedTool() === tool.id}
							title={tool.label}
						>
							<Icon class="echo-drawing-toolbar-icon" />
						</button>
					)
				}}
			</For>
		</div>
	)
}
