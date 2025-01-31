import type { DrawingTool } from '~/types'

interface ToolConfig {
	id: DrawingTool
	label: string
	getCursor: (color: string) => string
	strokeWidth: number
	opacity: {
		selected: number
		default: number
	}
}

export const toolConfig: Record<DrawingTool, ToolConfig> = {
	rectangle: {
		id: 'rectangle',
		label: 'Highlight',
		getCursor: () => 'crosshair',
		strokeWidth: 2,
		opacity: {
			selected: 1,
			default: 1,
		},
	},
	path: {
		id: 'path',
		label: 'Pen',
		getCursor: (color: string) =>
			`url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="${color.replace('#', '%23')}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="24" cy="24" r="8"/></svg>') 24 24, auto`,
		strokeWidth: 6,
		opacity: {
			selected: 0.6,
			default: 1,
		},
	},
}
