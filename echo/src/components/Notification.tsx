import { Component } from 'solid-js'
import { useRootStore } from '../contexts/RootContext'
import { CheckCircleIcon } from './icons/CheckCircleIcon'
import { CloseIcon } from './icons/CloseIcon'
import { XCircleIcon } from './icons/XCircleIcon'

export const Notification: Component = () => {
	const store = useRootStore()

	const hideNotification = () => {
		store.setWidget({ notification: { ...store.widget.notification, show: false } })
	}

	const getTitle = () => {
		switch (store.widget.notification.type) {
			case 'success':
				return 'Thank you for your feedback!'
			case 'error':
				return 'Something went wrong.'
			default:
				return ''
		}
	}

	return (
		<div
			class="echo-widget-notification"
			data-type={store.widget.notification.type}
			data-empty={!store.widget.notification.type}
			data-hidden={!store.widget.notification.show}
		>
			<button class="echo-notification-hide" onClick={hideNotification} title="Hide notification">
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
