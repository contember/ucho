import { Component, For } from 'solid-js'
import { drawingConfig } from '../config/drawingConfig'
import { useRootStore } from '../contexts/RootContext'
import { IconProps } from '../types'
import { ColorSelector } from './ColorSelector'
import { HighlightIcon, PenIcon } from './icons'

const ToolIcon: Record<string, Component<IconProps>> = {
	highlight: HighlightIcon,
	pen: PenIcon,
}

export const DrawingToolbar: Component = () => {
	const store = useRootStore()
	const tools = Object.values(drawingConfig)

	return (
		<div class="echo-drawing-toolbar" data-hidden={store.drawing.isDrawing}>
			<For each={tools}>
				{tool => {
					const Icon = ToolIcon[tool.id]
					return (
						<button
							onClick={() => store.setDrawing({ selectedTool: tool.id })}
							class="echo-drawing-toolbar-button"
							data-selected={store.drawing.selectedTool === tool.id}
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
