import { ParentComponent, createContext, useContext } from 'solid-js'
import { RootStore } from '../stores/rootStore'
import { createRootStore } from '../stores/rootStore'
import { EchoWidgetProps } from '../types'

const RootContext = createContext<RootStore>()

export const RootProvider: ParentComponent<EchoWidgetProps> = props => {
	const store = createRootStore({
		primaryColor: props.primaryColor!,
		onSubmit: props.onSubmit,
	})

	return <RootContext.Provider value={store}>{props.children}</RootContext.Provider>
}

export const useRootStore = () => {
	const context = useContext(RootContext)
	if (!context) {
		throw new Error('useStore must be used within WidgetProvider')
	}
	return context
}
export const useFeedbackStore = () => {
	const store = useRootStore()
	return [store.feedback, store.setFeedback]
}

export const useDrawingStore = () => {
	const store = useRootStore()
	return [store.drawing, store.setDrawing]
}

export const useWidgetStore = () => {
	const store = useRootStore()
	return [store.widget, store.setWidget]
}
