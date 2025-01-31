import { createStore } from 'solid-js/store'
import type { FeedbackData, FullEchoOptions, Notification, TextConfig } from '~/types'
import { getStoredPagesCount } from '~/utils'

export interface WidgetState {
	text: TextConfig
	isOpen: boolean
	primaryColor: string
	notification: Notification
	dimensions: {
		width: number
		height: number
	}
	isPagesDropdownOpen: boolean
	pagesCount: number
	welcomeMessageIsClosing: boolean
}

export interface WidgetStore {
	state: WidgetState
	setState: (state: Partial<WidgetState>) => void
	methods: {
		postSubmit: (result: Notification) => void
		onSubmit: (data: FeedbackData) => Promise<void>
	}
}

export const createWidgetStore = (config: FullEchoOptions, currentPageKey: string): WidgetStore => {
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
		isPagesDropdownOpen: false,
		pagesCount: getStoredPagesCount(),
		welcomeMessageIsClosing: false,
	})

	const methods = {
		postSubmit: (result: Notification) => {
			setState({ notification: { show: true, type: result.type, message: result.message } })

			setTimeout(() => {
				setState({ notification: { show: false, type: result.type, message: result.message } })
			}, 5000)
		},
		onSubmit: (data: FeedbackData) => {
			return config.onSubmit(data)
		},
	}

	return {
		state,
		setState,
		methods,
	}
}
