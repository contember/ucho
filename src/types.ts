export type Screenshot = `data:image/jpeg;base64,${string}`

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

export type ChatMessage = {
	id: string
	/** ISO 8601. Used for ordering; the widget never parses it for display beyond time-of-day. */
	createdAt: string
	text: string
	/** An annotated screenshot attached to this message, if there was one. */
	screenshot?: Screenshot
	author: {
		name: string
		/** True for the person using the widget, false for whoever is answering. */
		isCustomer: boolean
	}
}

/**
 * What the widget sends. A screenshot is attached by the user through the drawing
 * overlay, exactly as in the feedback flow.
 */
export type ChatOutgoingMessage = {
	text: string
	screenshot?: Screenshot
	/**
	 * Where the user was when they wrote this. Always sent — knowing the page is
	 * most of the value of asking inside the app, and it costs nothing.
	 *
	 * Note that `searchParams` is included verbatim; if the host puts tokens or
	 * personal data in query strings, strip them here before forwarding.
	 */
	page: LocationInfo
	/**
	 * Everything else — device, network, and the captured console buffer. Included
	 * **only** when a screenshot is attached, because that is the deliberate "I am
	 * reporting a problem" act and `metadata.console` can hold whatever the host
	 * application logged. Its `locationInfo` repeats `page`.
	 */
	metadata?: Metadata
}

/**
 * Whether anyone is going to answer, and when. Presence is deliberately not a
 * boolean the widget guesses at: the host answers it, because only the host knows
 * its own business hours and response times.
 */
export type ChatAvailability = {
	state: 'online' | 'offline'
	/** Shown verbatim, e.g. "Usually replies within an hour" or "Back tomorrow at 9:00". */
	message?: string
}

/**
 * Chat transport, supplied by the host application. Ucho never talks to a server
 * itself — exactly as with `onSubmit` — so the host decides what backs the
 * conversation and how often it polls.
 *
 * All three may return the whole transcript or only what is new; the widget
 * merges by `id`, so either works.
 */
export type ChatConfig = {
	/** Loaded once, the first time the panel is opened. */
	history: () => Promise<ChatMessage[]>
	/**
	 * Send one message. Must resolve with at least the message that was just sent —
	 * the widget has nothing to display otherwise and treats an empty resolve as a
	 * failure. Reject to surface an error and keep the composer's text.
	 */
	send: (message: ChatOutgoingMessage) => Promise<ChatMessage[]>
	/**
	 * Optional. Asked when the panel opens. Sending is never blocked by the answer —
	 * an offline chat still accepts messages, it just says when they will be read.
	 */
	availability?: () => Promise<ChatAvailability | undefined>
	/** Push incoming messages in. Returns its own teardown. */
	subscribe: (onMessages: (messages: ChatMessage[]) => void) => () => void
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
	chat: {
		title: string
		placeholder: string
		sendButton: string
		openTitle: string
		closeTitle: string
		emptyState: string
		loading: string
		errorMessage: string
		retryButton: string
		feedbackLink: string
		unreadLabel: string
		attachTitle: string
		attachBarText: string
		attachConfirm: string
		attachCancel: string
		attachmentLabel: string
		removeAttachment: string
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
	/** Enables the support chat panel. Omit it and the widget behaves exactly as before. */
	chat?: ChatConfig
	position?: Position
	primaryColor?: `#${string}`
	textConfig?: Partial<TextConfig>
	customInputs?: CustomInputConfig[]
	disableMinimization?: boolean
	fancyIcon?: boolean
}

export type FullConfig = Omit<Required<Config>, 'chat'> & {
	textConfig: TextConfig
	disableMinimization: boolean
	fancyIcon: boolean
	/** Absent when the host did not configure chat; the panel is then never rendered. */
	chat?: ChatConfig
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
