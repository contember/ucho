import { type Component, createContext, createEffect, JSXElement, on, useContext } from 'solid-js'
import { createStore, type Store } from '~/stores'
import type { FullConfig } from '~/types'

type ProviderProps = FullConfig & {
	children: JSXElement
}

const Context = createContext<Store>()

export const Provider: Component<ProviderProps> = props => {
	const store = createStore({
		primaryColor: props.primaryColor,
		onSubmit: data => props.onSubmit(data),
		textConfig: props.textConfig,
		position: props.position,
		customInputs: props.customInputs,
		disableMinimization: props.disableMinimization,
	})

	createEffect(on(
		() => [props.primaryColor, props.position, props.disableMinimization, props.textConfig, props.customInputs],
		() => {
			store.widget.setState({
				primaryColor: props.primaryColor,
				position: props.position,
				disableMinimization: props.disableMinimization,
				text: props.textConfig,
				customInputs: props.customInputs,
			})
		},
		{ defer: true },
	))

	return <Context.Provider value={store}>{props.children}</Context.Provider>
}

export const useStore = () => {
	const store = useContext(Context)
	if (!store) {
		throw new Error('useStore must be used within Provider')
	}
	return store
}
