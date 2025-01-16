export type Screenshot = `data:image/webp;base64,${string}` | `data:image/png;base64,${string}`

export interface BrowserInfo {
	width: number
	height: number
	screenWidth: number
	screenHeight: number
}

export interface Metadata {
	url: string
	userAgent: string
	timestamp: string
	browserInfo: BrowserInfo
}

export interface FeedbackData {
	comment: string
	screenshot?: Screenshot
	metadata: Metadata
}

export type Position = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'

export interface EchoWidgetProps {
	onSubmit: (data: FeedbackData) => void | Promise<void>
	position?: Position
	primaryColor?: `#${string}`
}

export type EchoOptions = EchoWidgetProps

export const POSITIONS: Record<Position, { [key: string]: string }> = {
	'top-left': {
		top: '20px',
		left: '20px',
	},
	'top-right': {
		top: '20px',
		right: '20px',
	},
	'bottom-left': {
		bottom: '20px',
		left: '20px',
	},
	'bottom-right': {
		bottom: '20px',
		right: '20px',
	},
}

export interface Point {
	x: number
	y: number
}

export interface IconProps {
	size?: number
	stroke?: string
	strokeWidth?: number
	class?: string
	style?: any
}
