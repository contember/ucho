import { Accessor, ParentComponent, createContext, createSignal, useContext } from 'solid-js'
import { FeedbackData } from '../types'

interface WidgetContextValue {
	isOpen: Accessor<boolean>
	isOpenStaggered: Accessor<boolean>
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
	const [isOpenStaggered, setIsOpenStaggered] = createSignal(false)
	const primaryColor = props.primaryColor

	const toggleWidget = () => {
		if (!isOpen()) {
			setIsOpen(true)
			setTimeout(() => setIsOpenStaggered(true), 0)
		} else {
			setIsOpenStaggered(false)
			setTimeout(() => setIsOpen(false), 250)
		}
	}

	const value: WidgetContextValue = {
		isOpen,
		isOpenStaggered,
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
