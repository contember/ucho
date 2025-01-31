import { createStore } from 'solid-js/store'
import type { Screenshot } from '~/types'

export interface FeedbackState {
	comment: string
	screenshot?: Screenshot
	isCapturing: boolean
	isMinimized: boolean
}

export interface FeedbackStore {
	state: FeedbackState
	setState: (state: Partial<FeedbackState>, isClearing?: boolean) => void
}

export const createFeedbackStore = (
	initialComment = '',
	onStateChange?: (state: Partial<FeedbackState>, isClearing?: boolean) => void,
): FeedbackStore => {
	const [state, setState] = createStore<FeedbackState>({
		comment: initialComment,
		screenshot: undefined,
		isCapturing: false,
		isMinimized: false,
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
