import { Component, createContext, useContext } from 'solid-js'
import { defaultText } from '../config/defaultText'
import { RootStore, createRootStore } from '../stores/rootStore'
import { FeedbackData, TextConfig } from '../types'

interface RootProviderProps {
	primaryColor: string
	onSubmit: (data: FeedbackData) => Promise<void>
	textConfig?: Partial<TextConfig>
	children: any
}

const RootContext = createContext<RootStore>()

export const RootProvider: Component<RootProviderProps> = props => {
	const store = createRootStore({
		primaryColor: props.primaryColor,
		onSubmit: props.onSubmit,
		text: { ...defaultText, ...props.textConfig },
	})

	return <RootContext.Provider value={store}>{props.children}</RootContext.Provider>
}

export const useRootStore = () => {
	const store = useContext(RootContext)
	if (!store) {
		throw new Error('useRootStore must be used within RootProvider')
	}
	return store
}
