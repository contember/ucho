import { Component } from 'solid-js'
import { Portal } from 'solid-js/web'
import { RootProvider } from '../contexts/RootContext'
import { drawingLayerStyles } from '../styles/DrawingLayer.styles'
import { drawingToolbarStyles } from '../styles/DrawingToolbar.styles'
import { feedbackFormStyles } from '../styles/FeedbackForm.styles'
import { overlayStyles } from '../styles/Overlay.styles'
import { tooltipStyles } from '../styles/Tooltip.styles'
import { welcomeMessageStyles } from '../styles/WelcomeMessage.styles'
import { widgetStyles } from '../styles/Widget.styles'
import { widgetButtonStyles } from '../styles/WidgetButton.styles'
import { EchoWidgetProps, StylesConfig } from '../types'
import { WidgetContent } from './WidgetContent'

const createStyles = (config: StylesConfig) => {
	return `
		${widgetStyles(config)}
		${widgetButtonStyles(config)}
		${feedbackFormStyles(config)}
		${drawingLayerStyles(config)}
		${drawingToolbarStyles(config)}
		${tooltipStyles(config)}
		${overlayStyles(config)}
		${welcomeMessageStyles(config)}
	`
}

export const Widget: Component<EchoWidgetProps> = props => {
	return (
		<Portal useShadow mount={document.body}>
			<style>{createStyles({ primaryColor: props.primaryColor! })}</style>
			<RootProvider primaryColor={props.primaryColor!} onSubmit={props.onSubmit}>
				<WidgetContent />
			</RootProvider>
		</Portal>
	)
}
