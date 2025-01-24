import { Component } from 'solid-js'
import { Portal } from 'solid-js/web'
import { RootProvider } from '~/contexts'
import { drawingLayerStyles, shapeActionsStyles } from '~/features/drawing/styles'
import {
	colorSelectorStyles,
	drawingToolbarStyles,
	feedbackFormStyles,
	notificationStyles,
	overlayStyles,
	tooltipStyles,
	welcomeMessageStyles,
	widgetButtonStyles,
	widgetStyles,
} from '~/styles'
import { EchoWidgetProps, StylesConfig } from '~/types'
import { WidgetContent } from './WidgetContent'

const createStyles = (config: StylesConfig) => {
	return `
		/* Echo Components */
		${widgetStyles(config)}
		${widgetButtonStyles(config)}
		${feedbackFormStyles(config)}
		${drawingLayerStyles(config)}
		${drawingToolbarStyles(config)}
		${tooltipStyles(config)}
		${overlayStyles(config)}
		${welcomeMessageStyles(config)}
		${shapeActionsStyles(config)}
		${notificationStyles(config)}
		${colorSelectorStyles(config)}
	`
}

export const Widget: Component<EchoWidgetProps> = props => {
	return (
		<Portal useShadow mount={document.body}>
			<style>{createStyles({ primaryColor: props.primaryColor! })}</style>
			<RootProvider primaryColor={props.primaryColor!} onSubmit={props.onSubmit} textConfig={props.textConfig}>
				<WidgetContent />
			</RootProvider>
		</Portal>
	)
}
