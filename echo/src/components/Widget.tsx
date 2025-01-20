import { Component } from 'solid-js'
import { Portal } from 'solid-js/web'
import { DrawingProvider } from '../contexts/DrawingContext'
import { FeedbackProvider } from '../contexts/FeedbackContext'
import { WidgetProvider } from '../contexts/WidgetContext'
import { EchoWidgetProps } from '../types'
import { WidgetContent } from './WidgetContent'

const createStyles = (primaryColor: string) => {
	const hoverColor = `color-mix(in srgb, ${primaryColor}, black 10%)`
	return `
		*, *::before, *::after {
			box-sizing: border-box;
		}

		.echo-widget {
			position: fixed;
			z-index: 1000000;
			pointer-events: auto;
			bottom: 20px;
			right: 20px;
		}

		.echo-widget-button {
			transition: all 0.3s ease;
			transform: scale(1);
			background: ${primaryColor};
			border: none;
			border-radius: 50%;
			width: 48px;
			height: 48px;
			cursor: pointer;
			box-shadow: 0 2px 8px rgba(0,0,0,0.15);
			display: flex;
			align-items: center;
			justify-content: center;
			position: relative;
			z-index: 10000;
		}

		.echo-widget-button:hover {
			transform: scale(1.1);
			box-shadow: 0 4px 12px rgba(0,0,0,0.2) !important;
		}

		.echo-widget-button:active {
			transform: scale(0.95);
		}

		.echo-feedback-form {
			position: fixed;
			bottom: 100px;
			right: 20px;
			width: 20rem;
			z-index: 10000;
			opacity: 0;
			transform: translateY(20px) scale(0.95);
			transform-origin: right center;
			transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
		}

		.echo-feedback-form.visible {
			opacity: 1;
			transform: translateY(0) scale(1);
		}

		.echo-feedback-form.minimized {
			transform: translateX(calc(100% + 20px));
		}

		.echo-feedback-container {
			position: relative;
			background: white;
			border-radius: 8px 0 0 8px;
			box-shadow: 0 4px 12px rgba(0,0,0,0.15);
			padding: 16px;
			width: 100%;
		}

		.echo-feedback-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 16px;
		}

		.echo-feedback-title {
			margin: 0;
		}

		.echo-minimize-button {
			background: transparent;
			border: none;
			padding: 8px;
			cursor: pointer;
			border-radius: 4px;
			display: flex;
			align-items: center;
			justify-content: center;
			margin-right: -8px;
			margin-top: -8px;
			transition: background-color 0.2s ease;
		}

		.echo-feedback-textarea {
			width: 100%;
			height: 100px;
			border-radius: 4px;
			border: 1px solid #ddd;
		}

		.echo-screenshot-preview {
			margin-top: 8px;
			max-height: 500px;
			overflow-y: auto;
			border: 1px solid #ddd;
			border-radius: 4px;
			padding: 4px;
			background-color: #f5f5f5;
		}

		.echo-screenshot-image {
			display: block;
			width: 100%;
			height: auto;
			object-fit: contain;
			border-radius: 2px;
		}

		.echo-submit-button {
			width: 100%;
			color: white;
			border: none;
			padding: 8px 16px;
			border-radius: 4px;
			background: ${primaryColor};
			cursor: pointer;
		}

		.echo-maximize-feedback-button {
			display: flex;
			position: absolute;
			top: 0px;
			left: -40px;
			width: 40px;
			height: 40px;
			border: none;
			border-radius: 8px 0 0 8px;
			align-items: center;
			justify-content: center;
			cursor: pointer;
			transition: all 0.3s ease;
			background: ${primaryColor};
		}

		.echo-maximize-feedback-button:hover {
			background-color: ${hoverColor} !important;
		}

		.echo-drawing-layer {
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			pointer-events: none;
			transform-origin: 0 0;
		}

		.echo-drawing-toolbar {
			position: fixed;
			top: 20px;
			left: 50%;
			transform: translateX(-50%);
			display: flex;
			gap: 8px;
			background: white;
			padding: 8px;
			border-radius: 8px;
			box-shadow: 0 2px 8px rgba(0,0,0,0.15);
		}

		.echo-drawing-toolbar-button {
			padding: 8px 16px;
			border-radius: 4px;
			font-size: 14px;
			cursor: pointer;
			transition: all 0.2s ease;
		}

		.echo-drawing-toolbar-button[data-selected="true"] {
			background: ${primaryColor};
			color: white;
			border: 1px solid ${primaryColor};
		}

		.echo-drawing-toolbar-button[data-selected="false"] {
			background: white;
			color: #666;
			border: 1px solid #ddd;
		}

		.echo-overlay {
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			box-sizing: content-box;
		}
	`
}

export const Widget: Component<EchoWidgetProps> = props => {
	return (
		<Portal useShadow mount={document.body}>
			<style>{createStyles(props.primaryColor!)}</style>
			<WidgetProvider primaryColor={props.primaryColor!} onSubmit={props.onSubmit}>
				<FeedbackProvider>
					<DrawingProvider>
						<WidgetContent />
					</DrawingProvider>
				</FeedbackProvider>
			</WidgetProvider>
		</Portal>
	)
}
