import { Component, Show } from 'solid-js'
import { useWidget } from '../contexts/WidgetContext'
import { Feedback } from './Feedback'
import { CloseIcon, MessageIcon } from './icons'

export const WidgetContent: Component = () => {
	const { isOpen, isOverlayVisible, primaryColor, toggleWidget } = useWidget()

	return (
		<div
			class="echo-widget"
			style={{
				'pointer-events': 'auto',
			}}
		>
			<button
				onClick={toggleWidget}
				class="echo-widget-button"
				style={{
					background: primaryColor,
					border: 'none',
					'border-radius': '50%',
					width: '48px',
					height: '48px',
					cursor: 'pointer',
					'box-shadow': '0 2px 8px rgba(0,0,0,0.15)',
					display: 'flex',
					'align-items': 'center',
					'justify-content': 'center',
					position: 'relative',
					'z-index': '2',
				}}
			>
				<MessageIcon
					stroke="white"
					style={{
						transition: 'opacity 0.2s ease',
						opacity: isOverlayVisible() ? '0' : '1',
					}}
				/>
				<CloseIcon
					stroke="white"
					style={{
						transition: 'opacity 0.2s ease',
						opacity: isOverlayVisible() ? '1' : '0',
						position: 'absolute',
					}}
				/>
			</button>

			<Show when={isOpen()}>
				<Feedback />
			</Show>
		</div>
	)
}
