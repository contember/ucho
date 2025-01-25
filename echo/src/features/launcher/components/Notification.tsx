import { Component } from 'solid-js'
import { CheckCircleIcon, CloseIcon, XCircleIcon } from '~/components/icons'
import { useEchoStore } from '~/contexts/EchoContext'

export const Notification: Component = () => {
	const store = useEchoStore()

	const hideNotification = () => {
		store.setWidget({ notification: { ...store.widget.notification, show: false } })
	}

	const getTitle = () => {
		switch (store.widget.notification.type) {
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
			data-type={store.widget.notification.type}
			data-empty={!store.widget.notification.type}
			data-hidden={!store.widget.notification.show}
		>
			<button class="echo-notification-hide" onClick={hideNotification} title={store.text.notification.hideTitle}>
				<CloseIcon size={16} />
			</button>
			<div class="echo-notification-icon">
				{store.widget.notification.type === 'success' ? (
					<CheckCircleIcon size={32} />
				) : store.widget.notification.type === 'error' ? (
					<XCircleIcon size={32} />
				) : null}
			</div>
			<div class="echo-notification-content">
				<div class="echo-notification-title">{getTitle()}</div>
				<div class="echo-notification-message">{store.widget.notification?.message}</div>
			</div>
		</div>
	)
}
