export type Screenshot = `data:image/png;base64,${string}`

export type BrowserInfo = {
	width: number
	height: number
	screenWidth: number
	screenHeight: number
	language: string
	languages: readonly string[]
	doNotTrack: string | null
	cookiesEnabled: boolean
	hardwareConcurrency: number
	deviceMemory?: number
	maxTouchPoints: number
	colorDepth: number
	pixelRatio: number
	availableWidth: number
	availableHeight: number
}

export type NetworkInfo = {
	effectiveType?: string
	downlink?: number
	rtt?: number
	saveData?: boolean
}

export type LocationInfo = {
	url: string
	origin: string
	pathname: string
	searchParams: Record<string, string>
	referrer: string
}

export type TimeInfo = {
	timezone: string
	localDateTime: string
}

export type Metadata = {
	userAgent: string
	browserInfo: BrowserInfo
	networkInfo: NetworkInfo
	locationInfo: LocationInfo
	timeInfo: TimeInfo
	console: ConsoleEntry[]
}

export type ConsoleEntry = {
	type: 'log' | 'warn' | 'error'
	message: string
	timestamp: string
}

export type FeedbackPayload = {
	message: string
	screenshot?: Screenshot
	metadata: Metadata
}

export type Position = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'

export type TextConfig = {
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

export type EchoConfig = {
	onSubmit: (data: FeedbackPayload) => Promise<Response | void>
	position?: Position
	primaryColor?: `#${string}`
	textConfig?: Partial<TextConfig>
}

export type FullEchoConfig = Required<EchoConfig> & {
	textConfig: TextConfig
}

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

export type Point = {
	x: number
	y: number
}

export type ShapeType = 'rectangle' | 'path'

export type DrawingTool = 'rectangle' | 'path'

export type Shape = {
	id: string
	type: ShapeType
	color: string
	points: Point[]
}

export type IconProps = {
	size?: number
	stroke?: string
	strokeWidth?: number
	class?: string
	style?: any
	fill?: string
}

export type Notification = {
	show: boolean
	type: 'success' | 'error' | null
	message: string | null
}
