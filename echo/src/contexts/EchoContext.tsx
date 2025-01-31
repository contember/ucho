import { type Component, JSXElement, createContext, useContext } from 'solid-js'
import { type EchoStore, createEchoStore } from '~/stores'
import type { FullEchoOptions } from '~/types'

type EchoProviderProps = FullEchoOptions & {
	children: JSXElement
}

const EchoContext = createContext<EchoStore>()

export const EchoProvider: Component<EchoProviderProps> = props => {
	const store = createEchoStore({
		primaryColor: props.primaryColor,
		onSubmit: props.onSubmit,
		textConfig: props.textConfig,
		position: props.position,
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
