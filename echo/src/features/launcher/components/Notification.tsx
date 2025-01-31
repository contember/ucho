import type { Component } from 'solid-js'
import { Button } from '~/components/atoms'
import { CheckCircleIcon, XCircleIcon, XIcon } from '~/components/icons'
import { useEchoStore } from '~/contexts/EchoContext'

export const Notification: Component = () => {
	const store = useEchoStore()

	const hideNotification = () => {
		store.widget.setState({ notification: { ...store.widget.state.notification, show: false } })
	}

	const getTitle = () => {
		switch (store.widget.state.notification.type) {
			case 'success':
				return store.text.notification.successTitle
			case 'error':
				return store.text.notification.errorTitle
			default:
				return ''
		}
	}

	return (
		<div
			class="echo-notification"
			data-type={store.widget.state.notification.type}
			data-empty={!store.widget.state.notification.type}
			data-hidden={!store.widget.state.notification.show}
		>
			<Button class="echo-notification-hide" variant="secondary" size="sm" onClick={hideNotification} title={store.text.notification.hideTitle}>
				<XIcon size={20} />
			</Button>
			<div class="echo-notification-icon">
				{store.widget.state.notification.type === 'success' ? (
					<CheckCircleIcon size={32} />
				) : store.widget.state.notification.type === 'error' ? (
					<XCircleIcon size={32} />
				) : null}
			</div>
			<div class="echo-notification-content">
				<div class="echo-notification-title">{getTitle()}</div>
				<div class="echo-notification-message">{store.widget.state.notification?.message}</div>
			</div>
		</div>
	)
}
