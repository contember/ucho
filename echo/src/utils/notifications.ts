import type { WidgetStore } from '~/stores/widgetStore'
import type { Notification } from '~/types'

const NOTIFICATION_DURATION = 5000

export const createNotificationManager = (widget: WidgetStore) => {
	let activeTimeout: number | null = null

	const clearActiveTimeout = () => {
		if (activeTimeout !== null) {
			window.clearTimeout(activeTimeout)
			activeTimeout = null
		}
	}

	return {
		show: (notification: Omit<Notification, 'show'>) => {
			clearActiveTimeout()

			widget.setState({
				notification: {
					...notification,
					show: true,
				},
			})

			activeTimeout = window.setTimeout(() => {
				widget.setState({
					notification: {
						...notification,
						show: false,
					},
				})
				activeTimeout = null
			}, NOTIFICATION_DURATION)
		},
		clear: () => {
			clearActiveTimeout()
			widget.setState({
				notification: {
					show: false,
					type: null,
					message: null,
				},
			})
		},
	}
}
