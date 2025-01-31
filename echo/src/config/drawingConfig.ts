import type { DrawingTool } from '~/types'

interface ToolConfig {
	id: DrawingTool
	label: string
	getCursor: (color: string) => string
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

export const toolConfig: Record<DrawingTool, ToolConfig> = {
	rectangle: {
		id: 'rectangle',
		label: 'Highlight',
		getCursor: () => 'crosshair',
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
		getCursor: (color: string) =>
			`url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="${color.replace('#', '%23')}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="24" cy="24" r="8"/></svg>') 24 24, auto`,
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
