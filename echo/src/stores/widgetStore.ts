import { createStore } from 'solid-js/store'
import type { FeedbackData, Notification } from '~/types'

export interface WidgetState {
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

export const createWidgetStore = (primaryColor: string, onSubmit: (data: FeedbackData) => Promise<void>): WidgetStore => {
	const [state, setState] = createStore<WidgetState>({
		isOpen: false,
		primaryColor,
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
		pagesCount: 0,
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
			return onSubmit(data)
		},
	}

	return {
		state,
		setState,
		methods,
	}
}
