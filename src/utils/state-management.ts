import type { DrawingState } from '~/stores/drawing-store'
import type { FeedbackState } from '~/stores/feedback-store'
import type { WidgetStore } from '~/stores/widget-store'
import { debounce } from './common'
import { getStoredPagesCount, savePageState } from './storage'

export type PageState = {
	feedback: FeedbackState
	drawing: DrawingState
}

export const createDebouncedStateSaver = (widget: WidgetStore) => {
	return debounce((pageKey: string, state: PageState, isClearing = false) => {
		const shouldSaveState = !isClearing || state.feedback.message.trim().length > 0 || state.drawing.shapes.length > 0

		if (shouldSaveState) {
			savePageState(pageKey, state)
			widget.setState({ pagesCount: getStoredPagesCount() })
		}
	}, 1000)
}
