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
		<div class="echo-drawing-toolbar" data-hide-when-drawing="true" role="toolbar" aria-label="Drawing Tools">
			<For each={tools}>
				{tool => {
					const Icon = ToolIcon[tool.id]
					return (
						<button
							class="echo-drawing-toolbar-button"
							title={tool.label}
							data-selected={store.drawing.state.selectedTool === tool.id}
							onClick={() => store.drawing.setState({ selectedTool: tool.id })}
							aria-label={tool.label}
							aria-pressed={store.drawing.state.selectedTool === tool.id}
							role="button"
						>
							<Icon class="echo-drawing-toolbar-icon" aria-hidden="true" />
						</button>
					)
				}}
			</For>
			<ColorSelector />
			{/* TODO: Add a confirmation dialog */}
			<button
				class="echo-drawing-toolbar-button"
				title="Clear drawings"
				onClick={() => store.drawing.setState({ shapes: [] }, true)}
				aria-label="Clear all drawings"
				role="button"
			>
				<TrashIcon class="echo-drawing-toolbar-icon" aria-hidden="true" />
			</button>
		</div>
	)
}
