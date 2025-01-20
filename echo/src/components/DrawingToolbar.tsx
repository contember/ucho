import { Component, For } from 'solid-js'
import { config } from '../config'
import { useDrawing } from '../contexts/DrawingContext'
import { useWidget } from '../contexts/WidgetContext'

export const DrawingToolbar: Component = () => {
	const { primaryColor } = useWidget()
	const {
		state: { selectedTool, setSelectedTool },
	} = useDrawing()

	const tools = Object.values(config.tools)

	return (
		<div
			style={{
				position: 'fixed',
				...config.toolbar.position,
				display: 'flex',
				gap: config.toolbar.style.gap,
				background: config.toolbar.style.background,
				padding: config.toolbar.style.padding,
				'border-radius': config.toolbar.style.borderRadius,
				'box-shadow': config.toolbar.style.boxShadow,
			}}
		>
			<For each={tools}>
				{tool => (
					<button
						onClick={() => setSelectedTool(tool.id)}
						style={{
							background: selectedTool() === tool.id ? primaryColor : 'white',
							color: selectedTool() === tool.id ? 'white' : '#666',
							border: `1px solid ${selectedTool() === tool.id ? primaryColor : '#ddd'}`,
							padding: config.toolbar.buttonStyle.padding,
							'border-radius': config.toolbar.buttonStyle.borderRadius,
							cursor: 'pointer',
							'font-size': config.toolbar.buttonStyle.fontSize,
							transition: 'all 0.2s ease',
						}}
					>
						{tool.label}
					</button>
				)}
			</For>
		</div>
	)
}
