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
	customInputs?: Record<string, CustomInputValue>
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

export type CustomInputValue = string | string[]

export type CustomInputBase = {
	id: string
	label?: string
	required?: boolean
	defaultValue?: CustomInputValue
	disabled?: boolean
	autoFocus?: boolean
}

export type TextInputConfig = CustomInputBase & {
	type: 'text'
	placeholder?: string
}

export type TextAreaConfig = CustomInputBase & {
	type: 'textarea'
	placeholder?: string
}

export type SelectOption = {
	value: string
	label: string
}

export type SelectInputConfig = CustomInputBase & {
	type: 'select'
	options: SelectOption[]
	placeholder?: string
}

export type RadioInputConfig = CustomInputBase & {
	type: 'radio'
	options: SelectOption[]
}

export type CheckboxInputConfig = CustomInputBase & {
	type: 'checkbox'
	options: SelectOption[]
}

export type CustomInputConfig = TextInputConfig | TextAreaConfig | SelectInputConfig | RadioInputConfig | CheckboxInputConfig

export type Config = {
	onSubmit: (data: FeedbackPayload) => Promise<Response | void>
	position?: Position
	primaryColor?: `#${string}`
	textConfig?: Partial<TextConfig>
	customInputs?: CustomInputConfig[]
	disableMinimization?: boolean
	fancyIcon?: boolean
}

export type FullConfig = Required<Config> & {
	textConfig: TextConfig
	disableMinimization: boolean
	fancyIcon: boolean
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

export type DrawingTool = 'rectangle' | 'path'

export type Shape = {
	id: string
	type: DrawingTool
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
