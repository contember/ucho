import { createStore } from 'solid-js/store'
import type { CustomInputConfig, FullConfig, Notification, Position, TextConfig } from '~/types'
import { getStoredPagesCount } from '~/utils'

export type WidgetState = {
	text: TextConfig
	isOpen: boolean
	primaryColor: string
	notification: Notification
	dimensions: {
		width: number
		height: number
	}
	isStoredFeedbackOpen: boolean
	pagesCount: number
	welcomeMessageIsClosing: boolean
	position: Position
	customInputs?: CustomInputConfig[]
	disableMinimization: boolean
}

export type WidgetStore = {
	state: WidgetState
	setState: (state: Partial<WidgetState>) => void
}

export const createWidgetStore = (config: FullConfig, currentPageKey: string): WidgetStore => {
	const [state, setState] = createStore<WidgetState>({
		text: config.textConfig,
		isOpen: false,
		primaryColor: config.primaryColor,
		notification: {
			show: false,
			type: null,
			message: null,
		},
		dimensions: {
			width: document.documentElement.clientWidth,
			height: document.documentElement.scrollHeight,
		},
		isStoredFeedbackOpen: false,
		pagesCount: getStoredPagesCount(),
		welcomeMessageIsClosing: false,
		position: config.position,
		customInputs: config.customInputs,
		disableMinimization: config.disableMinimization,
	})

	return {
		state,
		setState,
	}
}
