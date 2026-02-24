import { type Component, For } from 'solid-js'
import { HighlightIcon, PenIcon, TrashIcon } from '~/components/icons'
import { toolConfig } from '~/config/drawing-config'
import { useStore } from '~/contexts'
import type { IconProps } from '~/types'
import { ColorSelector } from './color-selector'

const ToolIcon: Record<string, Component<IconProps>> = {
	rectangle: HighlightIcon,
	path: PenIcon,
}

export const DrawingToolbar: Component = () => {
	const store = useStore()
	const tools = Object.values(toolConfig)

	return (
		<div class="ucho-drawing-toolbar" data-hide-when-drawing="true" role="toolbar" aria-label="Drawing Tools">
			<For each={tools}>
				{tool => {
					const Icon = ToolIcon[tool.id]
					return (
						<button
							class="ucho-drawing-toolbar-button"
							title={tool.label}
							data-selected={store.drawing.state.selectedTool === tool.id}
							onClick={() => store.drawing.setState({ selectedTool: tool.id })}
							aria-label={tool.label}
							aria-pressed={store.drawing.state.selectedTool === tool.id}
							role="button"
						>
							<Icon class="ucho-drawing-toolbar-icon" aria-hidden="true" />
						</button>
					)
				}}
			</For>
			<ColorSelector />
			{/* TODO: Add a confirmation dialog */}
			<button
				class="ucho-drawing-toolbar-button"
				title="Clear drawings"
				onClick={() => store.drawing.setState({ shapes: [] }, true)}
				aria-label="Clear all drawings"
				role="button"
			>
				<TrashIcon class="ucho-drawing-toolbar-icon" aria-hidden="true" />
			</button>
		</div>
	)
}
