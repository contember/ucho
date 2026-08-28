import { type Component, createContext, createEffect, JSXElement, on, useContext } from 'solid-js'
import { createStore, getDefaultCustomValues, type Store } from '~/stores'
import type { CustomInputValue, FullConfig } from '~/types'

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
		fancyIcon: props.fancyIcon,
	})

	createEffect(on(
		() => [props.primaryColor, props.position, props.disableMinimization, props.fancyIcon, props.textConfig, props.customInputs],
		() => {
			store.widget.setState({
				primaryColor: props.primaryColor,
				position: props.position,
				disableMinimization: props.disableMinimization,
				fancyIcon: props.fancyIcon,
				text: props.textConfig,
				customInputs: props.customInputs,
			})

			// Custom input values are seeded once when the store is built, so inputs
			// added by a later `update()` would render with no value at all. Reseed
			// against the new config: keep what the user already typed, default what
			// is new, and drop what no longer exists.
			const defaults = getDefaultCustomValues(props.customInputs)
			const current = store.feedback.state.customInputValues
			const reseeded: Record<string, CustomInputValue> = {}
			for (const id of Object.keys(defaults)) {
				reseeded[id] = id in current ? current[id] : defaults[id]
			}
			// `update()` may be called on every render of a host framework, so only
			// write when the value set actually changed.
			const currentIds = Object.keys(current)
			const isUnchanged = currentIds.length === Object.keys(reseeded).length
				&& currentIds.every(id => {
					const before = current[id]
					const after = reseeded[id]
					return Array.isArray(before) && Array.isArray(after)
						? before.length === after.length && before.every((value, index) => value === after[index])
						: before === after
				})

			if (!isUnchanged) {
				store.feedback.setState({ customInputValues: reseeded })
			}
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
