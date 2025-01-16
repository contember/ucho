import { Component, Show, createSignal } from 'solid-js'
import { Portal } from 'solid-js/web'
import { EchoWidgetProps } from '../types'
import { FeedbackForm } from './FeedbackForm'

const styles = `
.echo-widget-button {
	transition: all 0.3s ease;
	transform: scale(1);
}

.echo-widget-button:hover {
	transform: scale(1.1);
	box-shadow: 0 4px 12px rgba(0,0,0,0.2) !important;
}

.echo-widget-button:active {
	transform: scale(0.95);
}

.echo-widget-overlay {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0);
	z-index: 999;
	transition: background-color 0.25s ease;
}

.echo-widget-overlay.visible {
	background-color: rgba(0, 0, 0, 0.2);
}

.echo-widget {
	position: relative;
	z-index: 1000;
}

.feedback-form-container {
	position: absolute;
	bottom: 60px;
	right: 0;
	opacity: 0;
	transform: translateY(20px) scale(0.95);
	transition: opacity 0.3s ease, transform 0.3s ease;
}

.feedback-form-container.visible {
	opacity: 1;
	transform: translateY(0) scale(1);
}
`

export const Widget: Component<EchoWidgetProps> = props => {
	const [isOpen, setIsOpen] = createSignal(false)
	const [isOverlayVisible, setIsOverlayVisible] = createSignal(false)
	const primaryColor = props.primaryColor || '#6B46C1'

	if (typeof document !== 'undefined') {
		const styleSheet = document.createElement('style')
		styleSheet.textContent = styles
		document.head.appendChild(styleSheet)
	}

	const toggleWidget = () => {
		if (!isOpen()) {
			setIsOpen(true)
			setTimeout(() => setIsOverlayVisible(true), 0)
		} else {
			setIsOverlayVisible(false)
			setTimeout(() => setIsOpen(false), 250)
		}
	}

	return (
		<>
			<Show when={isOpen()}>
				<Portal>
					<div class={`echo-widget-overlay ${isOverlayVisible() ? 'visible' : ''}`} onClick={toggleWidget} />
				</Portal>
			</Show>
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
					<svg
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="white"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						style={{
							transition: 'transform 0.3s ease',
							transform: isOverlayVisible() ? 'rotate(90deg)' : 'rotate(0deg)',
						}}
					>
						{isOverlayVisible() ? (
							<>
								<line x1="18" y1="6" x2="6" y2="18" />
								<line x1="6" y1="6" x2="18" y2="18" />
							</>
						) : (
							<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
						)}
					</svg>
				</button>

				<Show when={isOpen()}>
					<div class={`feedback-form-container ${isOverlayVisible() ? 'visible' : ''}`}>
						<FeedbackForm onClose={toggleWidget} onSubmit={props.onSubmit} primaryColor={primaryColor} />
					</div>
				</Show>
			</div>
		</>
	)
}
