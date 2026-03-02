import { createStore } from 'solid-js/store'
import type { CustomInputConfig, CustomInputValue, FullConfig, Screenshot } from '~/types'
import { loadPageState } from '~/utils'

export type FeedbackState = {
	message: string
	screenshot?: Screenshot
	isCapturing: boolean
	isMinimized: boolean
	customInputValues: Record<string, CustomInputValue>
	hasUserInteracted: boolean
}

export type FeedbackStore = {
	state: FeedbackState
	setState: (state: Partial<FeedbackState>, isClearing?: boolean) => void
}

export const getDefaultCustomValues = (customInputs?: CustomInputConfig[]) => {
	return (
		customInputs?.reduce(
			(acc, input) => {
				acc[input.id] = input.defaultValue ?? (input.type === 'checkbox' ? [] : '')
				return acc
			},
			{} as Record<string, CustomInputValue>,
		) || {}
	)
}

export const createFeedbackStore = (
	config: FullConfig,
	currentPageKey: string,
	onStateChange?: (state: Partial<FeedbackState>, isClearing?: boolean) => void,
	customInputs?: CustomInputConfig[],
) => {
	const defaultCustomValues = getDefaultCustomValues(customInputs)

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
		hasUserInteracted: false,
	})

	const wrappedSetState = (newState: Partial<FeedbackState>, isClearing = false) => {
		const isSystemChange = 'isCapturing' in newState || 'isMinimized' in newState || isClearing

		if (!isSystemChange && !state.hasUserInteracted) {
			setState({ hasUserInteracted: true })
		}

		setState(newState)
		if (state.hasUserInteracted || isSystemChange) {
			onStateChange?.(newState, isClearing)
		}
	}

	return {
		state,
		setState: wrappedSetState,
	}
}
