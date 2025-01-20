import { Component, For } from 'solid-js'
import { config } from '../config'
import { useDrawing } from '../contexts/DrawingContext'

export const DrawingToolbar: Component = () => {
	const {
		state: { selectedTool, setSelectedTool },
	} = useDrawing()

	const tools = Object.values(config)

	return (
		<div class="echo-drawing-toolbar">
			<For each={tools}>
				{tool => (
					<button onClick={() => setSelectedTool(tool.id)} class="echo-drawing-toolbar-button" data-selected={selectedTool() === tool.id}>
						{tool.label}
					</button>
				)}
			</For>
		</div>
	)
}
