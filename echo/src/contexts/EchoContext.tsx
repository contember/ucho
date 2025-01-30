import { type Component, createContext, useContext } from 'solid-js'
import { defaultText } from '~/config/defaultText'
import { createEchoStore, type EchoStore } from '~/stores'
import type { FeedbackData, TextConfig } from '~/types'

interface EchoProviderProps {
	primaryColor: string
	onSubmit: (data: FeedbackData) => Promise<void>
	textConfig?: Partial<TextConfig>
	children: any
}

const EchoContext = createContext<EchoStore>()

export const EchoProvider: Component<EchoProviderProps> = props => {
	const store = createEchoStore({
		primaryColor: props.primaryColor,
		onSubmit: props.onSubmit,
		text: { ...defaultText, ...props.textConfig },
	})

	return <EchoContext.Provider value={store}>{props.children}</EchoContext.Provider>
}

export const useEchoStore = () => {
	const store = useContext(EchoContext)
	if (!store) {
		throw new Error('useEchoStore must be used within EchoProvider')
	}
	return store
}
