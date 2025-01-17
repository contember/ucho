import { Component } from 'solid-js'
import { useDrawing } from '../contexts/DrawingContext'
import { useWidget } from '../contexts/WidgetContext'
import { DrawingTool } from '../types'

export const DrawingToolbar: Component = () => {
	const { primaryColor } = useWidget()
	const {
		state: { selectedTool, setSelectedTool },
	} = useDrawing()

	const tools: { id: DrawingTool; label: string }[] = [
		{ id: 'highlight', label: 'Highlight' },
		{ id: 'pen', label: 'Pen' },
	]

	return (
		<div
			style={{
				position: 'fixed',
				top: '20px',
				left: '50%',
				transform: 'translateX(-50%)',
				display: 'flex',
				gap: '8px',
				background: 'white',
				padding: '8px',
				'border-radius': '8px',
				'box-shadow': '0 2px 8px rgba(0,0,0,0.15)',
			}}
		>
			{tools.map(tool => (
				// biome-ignore lint/correctness/useJsxKeyInIterable: <explanation>
				<button
					onClick={() => setSelectedTool(tool.id)}
					style={{
						background: selectedTool() === tool.id ? primaryColor : 'white',
						color: selectedTool() === tool.id ? 'white' : '#666',
						border: `1px solid ${selectedTool() === tool.id ? primaryColor : '#ddd'}`,
						padding: '8px 16px',
						'border-radius': '4px',
						cursor: 'pointer',
						'font-size': '14px',
						transition: 'all 0.2s ease',
					}}
				>
					{tool.label}
				</button>
			))}
		</div>
	)
}
