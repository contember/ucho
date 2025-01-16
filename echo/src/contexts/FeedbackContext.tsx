import { ParentComponent, createContext, createSignal, useContext } from 'solid-js'
import { Screenshot } from '../types'

interface FeedbackContextValue {
	comment: () => string
	setComment: (value: string) => void
	screenshot: () => Screenshot | undefined
	setScreenshot: (value: Screenshot | undefined) => void
	isCapturing: () => boolean
	setIsCapturing: (value: boolean) => void
	isMinimized: () => boolean
	setIsMinimized: (value: boolean) => void
}

const FeedbackContext = createContext<FeedbackContextValue>()

export const FeedbackProvider: ParentComponent = props => {
	const [comment, setComment] = createSignal('')
	const [screenshot, setScreenshot] = createSignal<Screenshot | undefined>(undefined)
	const [isCapturing, setIsCapturing] = createSignal(false)
	const [isMinimized, setIsMinimized] = createSignal(false)

	const value: FeedbackContextValue = {
		comment,
		setComment,
		screenshot,
		setScreenshot,
		isCapturing,
		setIsCapturing,
		isMinimized,
		setIsMinimized,
	}

	return <FeedbackContext.Provider value={value}>{props.children}</FeedbackContext.Provider>
}

export const useFeedback = () => {
	const context = useContext(FeedbackContext)
	if (!context) {
		throw new Error('useFeedback must be used within a FeedbackProvider')
	}
	return context
}
