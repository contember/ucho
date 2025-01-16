export const POSITIONS = {
	'bottom-right': { bottom: '20px', right: '20px', top: 'auto', left: 'auto' },
	'bottom-left': { bottom: '20px', left: '20px', top: 'auto', right: 'auto' },
	'top-right': { top: '20px', right: '20px', bottom: 'auto', left: 'auto' },
	'top-left': { top: '20px', left: '20px', bottom: 'auto', right: 'auto' },
} as const

export type Position = keyof typeof POSITIONS

export type Screenshot = `data:image/webp;base64,${string}` | `data:image/png;base64,${string}`

export interface BrowserInfo {
	readonly width: number
	readonly height: number
	readonly screenWidth: number
	readonly screenHeight: number
}

export interface Metadata {
	readonly url: string
	readonly userAgent: string
	readonly timestamp: string
	readonly browserInfo: BrowserInfo
}

export interface FeedbackData {
	readonly screenshot?: Screenshot
	readonly annotations?: ReadonlyArray<Annotation>
	readonly comment: string
	readonly metadata: Metadata
}

export type AnnotationType = 'highlight' | 'arrow' | 'text' | 'rectangle'

export interface BaseAnnotation {
	readonly type: AnnotationType
	readonly x: number
	readonly y: number
	readonly color: string
}

export interface SizedAnnotation extends BaseAnnotation {
	readonly type: Extract<AnnotationType, 'highlight' | 'rectangle'>
	readonly width: number
	readonly height: number
}

export interface TextAnnotation extends BaseAnnotation {
	readonly type: Extract<AnnotationType, 'text'>
	readonly text: string
}

export interface ArrowAnnotation extends BaseAnnotation {
	readonly type: Extract<AnnotationType, 'arrow'>
	readonly width: number // Used for arrow length
}

export type Annotation = SizedAnnotation | TextAnnotation | ArrowAnnotation

export interface EchoWidgetProps {
	readonly position?: Position
	readonly primaryColor?: `#${string}` // Enforce hex color format
	readonly onSubmit: (data: FeedbackData) => void | Promise<void>
}

export interface EchoOptions extends Omit<EchoWidgetProps, 'position'> {
	readonly position?: Position
}

export type StylePosition = (typeof POSITIONS)[Position]

export class EchoInitializationError extends Error {
	constructor(message: string) {
		super(message)
		this.name = 'EchoInitializationError'
	}
}

export class EchoSubmissionError extends Error {
	constructor(message: string) {
		super(message)
		this.name = 'EchoSubmissionError'
	}
}
