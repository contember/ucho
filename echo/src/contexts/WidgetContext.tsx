import { Accessor, ParentComponent, createContext, createSignal, useContext } from 'solid-js'
import { FeedbackData } from '../types'

interface WidgetContextValue {
	isOpen: Accessor<boolean>
	isOverlayVisible: Accessor<boolean>
	primaryColor: string
	toggleWidget: () => void
	onSubmit: (data: FeedbackData) => void | Promise<void>
}

const WidgetContext = createContext<WidgetContextValue>()

export const WidgetProvider: ParentComponent<{
	primaryColor: string
	onSubmit: (data: FeedbackData) => void | Promise<void>
}> = props => {
	const [isOpen, setIsOpen] = createSignal(false)
	const [isOverlayVisible, setIsOverlayVisible] = createSignal(false)
	const primaryColor = props.primaryColor

	const toggleWidget = () => {
		if (!isOpen()) {
			setIsOpen(true)
			setTimeout(() => setIsOverlayVisible(true), 0)
		} else {
			setIsOverlayVisible(false)
			setTimeout(() => setIsOpen(false), 250)
		}
	}

	const value: WidgetContextValue = {
		isOpen,
		isOverlayVisible,
		primaryColor,
		toggleWidget,
		onSubmit: props.onSubmit,
	}

	return <WidgetContext.Provider value={value}>{props.children}</WidgetContext.Provider>
}

export const useWidget = () => {
	const context = useContext(WidgetContext)
	if (!context) {
		throw new Error('useWidget must be used within a WidgetProvider')
	}
	return context
}
