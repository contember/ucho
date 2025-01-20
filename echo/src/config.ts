import { DrawingTool } from './types'

interface ToolConfig {
	id: DrawingTool
	label: string
	cursor: string
	strokeWidth: {
		active: number
		normal: number
		selected: number
	}
	opacity: {
		active: number
		normal: number
	}
	hysteresis?: number // Minimum distance in pixels between points
}

export const config: Record<DrawingTool, ToolConfig> = {
	highlight: {
		id: 'highlight',
		label: 'Highlight',
		cursor: 'crosshair',
		strokeWidth: {
			active: 2,
			normal: 2,
			selected: 3,
		},
		opacity: {
			active: 1,
			normal: 1,
		},
	},
	pen: {
		id: 'pen',
		label: 'Pen',
		cursor: 'none', // custom SVG cursor
		strokeWidth: {
			active: 6,
			normal: 6,
			selected: 7,
		},
		opacity: {
			active: 0.8,
			normal: 1,
		},
		hysteresis: 10, // Only record points that are at least 5px away from the last point
	},
}
