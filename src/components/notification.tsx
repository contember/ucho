import type { Component } from 'solid-js'
import { Button } from '~/components/button'
import { CheckCircleIcon, XCircleIcon, XIcon } from '~/components/icons'
import { useStore } from '~/contexts'

export const Notification: Component = () => {
	const store = useStore()

	const hideNotification = () => {
		store.widget.setState({ notification: { ...store.widget.state.notification, show: false } })
	}

	const getTitle = () => {
		switch (store.widget.state.notification.type) {
			case 'success':
				return store.widget.state.text.notification.successTitle
			case 'error':
				return store.widget.state.text.notification.errorTitle
			default:
				return ''
		}
	}

	return (
		<div
			class="ucho-notification"
			data-type={store.widget.state.notification.type}
			data-empty={!store.widget.state.notification.type}
			data-hidden={!store.widget.state.notification.show}
		>
			<Button
				class="ucho-notification-hide"
				variant="secondary"
				size="sm"
				onClick={hideNotification}
				title={store.widget.state.text.notification.hideTitle}
			>
				<XIcon size={20} />
			</Button>
			<div class="ucho-notification-icon">
				{store.widget.state.notification.type === 'success'
					? <CheckCircleIcon size={32} />
					: store.widget.state.notification.type === 'error'
					? <XCircleIcon size={32} />
					: null}
			</div>
			<div class="ucho-notification-content">
				<div class="ucho-notification-title">{getTitle()}</div>
				<div class="ucho-notification-message">{store.widget.state.notification?.message}</div>
			</div>
		</div>
	)
}
