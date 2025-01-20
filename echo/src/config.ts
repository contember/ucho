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

interface Config {
	tools: Record<DrawingTool, ToolConfig>
	toolbar: {
		position: {
			top: string
			left: string
			transform: string
		}
		style: {
			background: string
			padding: string
			borderRadius: string
			boxShadow: string
			gap: string
		}
		buttonStyle: {
			padding: string
			borderRadius: string
			fontSize: string
		}
	}
	overlay: {
		maskBackground: string
		maskOpacity: number
	}
}

export const config: Config = {
	tools: {
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
	},
	toolbar: {
		position: {
			top: '20px',
			left: '50%',
			transform: 'translateX(-50%)',
		},
		style: {
			background: 'white',
			padding: '8px',
			borderRadius: '8px',
			boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
			gap: '8px',
		},
		buttonStyle: {
			padding: '8px 16px',
			borderRadius: '4px',
			fontSize: '14px',
		},
	},
	overlay: {
		maskBackground: 'rgba(0, 0, 0, 0.2)',
		maskOpacity: 1,
	},
}
