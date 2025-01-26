import { Component, onCleanup, onMount } from 'solid-js'
import { Portal } from 'solid-js/web'
import { EchoProvider } from '~/contexts'
import { useEchoStore } from '~/contexts/EchoContext'
import { colorSelectorStyles, drawingLayerStyles, drawingToolbarStyles, shapeActionsStyles, tooltipStyles } from '~/features/drawing/styles'
import { feedbackFormStyles } from '~/features/feedback/styles'
import { echoButtonStyles } from '~/features/launcher/styles/EchoButton.styles'
import { notificationStyles } from '~/features/launcher/styles/Notification.styles'
import { savedPagesDropdownStyles } from '~/features/launcher/styles/SavedPagesDropdown.styles'
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
		${savedPagesDropdownStyles(config)}

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
	let rootRef: HTMLDivElement | undefined
	let observer: MutationObserver | undefined

	return (
		<EchoProvider primaryColor={props.primaryColor!} onSubmit={props.onSubmit} textConfig={props.textConfig}>
			<EchoRootInner rootRef={rootRef} observer={observer} primaryColor={props.primaryColor!}>
				{props.children}
			</EchoRootInner>
		</EchoProvider>
	)
}

const EchoRootInner: Component<{
	rootRef: HTMLDivElement | undefined
	observer: MutationObserver | undefined
	primaryColor: string
	children: any
}> = props => {
	const store = useEchoStore()
	let localObserver: MutationObserver | undefined

	const updateHeight = () => {
		store.setWidget({
			dimensions: {
				width: document.documentElement.clientWidth,
				height: document.documentElement.scrollHeight,
			},
		})
	}

	onMount(() => {
		localObserver = new MutationObserver(updateHeight)
		localObserver.observe(document.body, {
			childList: true,
			subtree: true,
			attributes: true,
		})
		window.addEventListener('resize', updateHeight)

		updateHeight()
	})

	onCleanup(() => {
		localObserver?.disconnect()
		window.removeEventListener('resize', updateHeight)
	})

	return (
		<div
			ref={props.rootRef}
			class="echo-root"
			data-drawing={store.drawing.isDrawing}
			style={{
				height: `${store.widget.dimensions.height}px`,
				width: `${store.widget.dimensions.width}px`,
			}}
		>
			<style>{createStyles({ primaryColor: props.primaryColor })}</style>
			{props.children}
		</div>
	)
}
