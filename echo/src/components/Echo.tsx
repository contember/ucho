import { Component } from 'solid-js'
import { Portal } from 'solid-js/web'
import { EchoProvider } from '~/contexts'
import { useEchoStore } from '~/contexts/EchoContext'
import { colorSelectorStyles, drawingLayerStyles, drawingToolbarStyles, shapeActionsStyles, tooltipStyles } from '~/features/drawing/styles'
import { feedbackFormStyles } from '~/features/feedback/styles'
import { echoButtonStyles } from '~/features/launcher/styles/EchoButton.styles'
import { notificationStyles } from '~/features/launcher/styles/Notification.styles'
import { welcomeMessageStyles } from '~/features/launcher/styles/WelcomeMessage.styles'
import { echoStyles } from '~/styles'
import { EchoWidgetProps, StylesConfig } from '~/types'
import { EchoLayout } from './EchoLayout'

const createStyles = (config: StylesConfig) => {
	return `
		/* Echo Components */
		${echoStyles(config)}

		/* Launcher Components */
		${notificationStyles(config)}
		${welcomeMessageStyles(config)}
		${echoButtonStyles(config)}

		/* Drawing Components */
		${drawingLayerStyles(config)}
		${drawingToolbarStyles(config)}
		${colorSelectorStyles(config)}
		${shapeActionsStyles(config)}
		${tooltipStyles(config)}
		
		/* Feedback Components */
		${feedbackFormStyles(config)}
	`
}

export const Echo: Component<EchoWidgetProps> = props => {
	return (
		<Portal useShadow mount={document.body}>
			<EchoRoot {...props}>
				<EchoLayout />
			</EchoRoot>
		</Portal>
	)
}

const EchoRoot: Component<EchoWidgetProps> = props => {
	return (
		<EchoProvider primaryColor={props.primaryColor!} onSubmit={props.onSubmit} textConfig={props.textConfig}>
			<div class="echo-root" data-drawing={useEchoStore().drawing.isDrawing}>
				<style>{createStyles({ primaryColor: props.primaryColor! })}</style>
				{props.children}
			</div>
		</EchoProvider>
	)
}
