import type { DrawingState } from '~/stores/drawingStore'
import type { FeedbackState } from '~/stores/feedbackStore'
import type { WidgetStore } from '~/stores/widgetStore'
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
