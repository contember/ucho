import { createStore } from 'solid-js/store'
import type { CustomInputConfig, CustomInputValue, FullEchoConfig, Screenshot } from '~/types'
import { loadPageState } from '~/utils'

export type FeedbackState = {
	message: string
	screenshot?: Screenshot
	isCapturing: boolean
	isMinimized: boolean
	customInputValues: Record<string, CustomInputValue>
}

export type FeedbackStore = {
	state: FeedbackState
	setState: (state: Partial<FeedbackState>, isClearing?: boolean) => void
}

export const createFeedbackStore = (
	config: FullEchoConfig,
	currentPageKey: string,
	onStateChange?: (state: Partial<FeedbackState>, isClearing?: boolean) => void,
	customInputs?: CustomInputConfig[],
) => {
	const defaultCustomValues =
		customInputs?.reduce(
			(acc, input) => {
				acc[input.id] = input.defaultValue ?? (input.type === 'checkbox' ? [] : '')
				return acc
			},
			{} as Record<string, CustomInputValue>,
		) || {}

	const savedState = loadPageState(currentPageKey)
	const savedCustomValues = savedState?.feedback.customInputValues || {}
	const initialCustomValues = {
		...defaultCustomValues,
		...savedCustomValues,
	}

	const [state, setState] = createStore<FeedbackState>({
		message: savedState?.feedback?.message || '',
		screenshot: undefined,
		isCapturing: false,
		isMinimized: false,
		customInputValues: initialCustomValues,
	})

	const wrappedSetState = (newState: Partial<FeedbackState>, isClearing = false) => {
		setState(newState)
		onStateChange?.(newState, isClearing)
	}

	return {
		state,
		setState: wrappedSetState,
	}
}
