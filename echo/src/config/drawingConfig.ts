import type { DrawingTool } from '~/types'

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
	hysteresis?: number
}

export const drawingConfig: Record<DrawingTool, ToolConfig> = {
	rectangle: {
		id: 'rectangle',
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
	path: {
		id: 'path',
		label: 'Pen',
		cursor: 'none', // custom SVG cursor
		strokeWidth: {
			active: 6,
			normal: 6,
			selected: 7,
		},
		opacity: {
			active: 0.6,
			normal: 1,
		},
		hysteresis: 10, // Only record points that are at least Xpx away from the last point
	},
}
