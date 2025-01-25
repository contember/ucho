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

export interface TextConfig {
	welcomeMessage: {
		text: string
		closeAriaLabel: string
	}
	feedbackForm: {
		title: string
		placeholder: string
		screenshotAlt: string
		submitButton: string
		minimizeTitle: string
		expandTitle: string
		closeTitle: string
		showFormTitle: string
	}
	notification: {
		successTitle: string
		errorTitle: string
		errorMessage: string
		hideTitle: string
	}
	drawingTooltip: {
		text: string
	}
}

export interface EchoWidgetProps {
	onSubmit: (data: FeedbackData) => Promise<void>
	position?: Position
	primaryColor?: `#${string}`
	textConfig?: Partial<TextConfig>
	children?: any
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

export type ShapeType = 'rectangle' | 'path'

export type DrawingTool = 'highlight' | 'pen'

export interface Shape {
	id: string
	type: ShapeType
	color: string
	points: Point[]
}

export interface IconProps {
	size?: number
	stroke?: string
	strokeWidth?: number
	class?: string
	style?: any
	fill?: string
}

export interface StylesConfig {
	primaryColor: string
}

export interface Notification {
	show: boolean
	type: 'success' | 'error' | null
	message: string | null
}
