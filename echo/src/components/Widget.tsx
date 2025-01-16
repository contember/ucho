import { Component } from 'solid-js'
import { DrawingProvider } from '../contexts/DrawingContext'
import { FeedbackProvider } from '../contexts/FeedbackContext'
import { WidgetProvider } from '../contexts/WidgetContext'
import { EchoWidgetProps } from '../types'
import { WidgetContent } from './WidgetContent'

const createStyles = (primaryColor: string) => {
	const hoverColor = `color-mix(in srgb, ${primaryColor}, black 10%)`
	return `
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

		.echo-widget {
			position: relative;
			z-index: 1000;
		}

		.echo-feedback-form {
			position: absolute;
			bottom: 60px;
			right: 0;
			opacity: 0;
			transform: translateY(20px) scale(0.95);
			transition: opacity 0.3s ease, transform 0.3s ease;
		}

		.echo-feedback-form.visible {
			opacity: 1;
			transform: translateY(0) scale(1);
		}

		.echo-maximize-feedback-button {
			transition: all 0.3s ease !important;
		}

		.echo-maximize-feedback-button:hover {
			background-color: ${hoverColor} !important;
		}
	`
}

export const Widget: Component<EchoWidgetProps> = props => {
	if (typeof document !== 'undefined') {
		const styleSheet = document.createElement('style')
		styleSheet.textContent = createStyles(props.primaryColor!)
		document.head.appendChild(styleSheet)
	}

	return (
		<WidgetProvider primaryColor={props.primaryColor!} onSubmit={props.onSubmit}>
			<FeedbackProvider>
				<DrawingProvider>
					<WidgetContent />
				</DrawingProvider>
			</FeedbackProvider>
		</WidgetProvider>
	)
}
