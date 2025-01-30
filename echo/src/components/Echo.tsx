import { type Component, createEffect, onCleanup, onMount } from 'solid-js'
import { Portal } from 'solid-js/web'
import { EchoProvider } from '~/contexts'
import { useEchoStore } from '~/contexts/EchoContext'
import {
	colorSelectorStyles,
	drawingLayerStyles,
	drawingToolbarStyles,
	shapeActionsStyles,
	tooltipStyles,
} from '~/features/drawing/styles'
import { feedbackFormStyles } from '~/features/feedback/styles'
import { echoLauncherButtonStyles } from '~/features/launcher/styles/EchoLauncherButton.styles'
import { notificationStyles } from '~/features/launcher/styles/Notification.styles'
import { savedPagesDropdownStyles } from '~/features/launcher/styles/SavedPagesDropdown.styles'
import { welcomeMessageStyles } from '~/features/launcher/styles/WelcomeMessage.styles'
import { echoStyles } from '~/styles'
import type { EchoOptions, EnrichedStylesConfig, StylesConfig } from '~/types'
import { getContrastColor } from '~/utils/color'
import { buttonStyles } from './atoms'
import { EchoLayout } from './EchoLayout'

const enrichConfig = (config: StylesConfig): EnrichedStylesConfig => {
	return {
		...config,
		primaryTextColor: getContrastColor(config.primaryColor),
		primaryColorLighter: `color-mix(in srgb, ${config.primaryColor} 100%, white 20%)`,
		primaryColorLightest: `color-mix(in srgb, ${config.primaryColor} 7%, white 100%)`,
	}
}

const createStyles = (config: StylesConfig) => {
	const enrichedConfig = enrichConfig(config)

	return `
		.echo-root {
		    --dark-shadow-color: rgba(0, 0, 0, 0.6);
		    --light-shadow-color: rgba(255, 255, 255, 0.1);
		}
	
		/* Echo Components */
		${echoStyles(enrichedConfig)}

		/* Atoms */
		${buttonStyles(enrichedConfig)}

		/* Launcher Components */
		${notificationStyles(enrichedConfig)}
		${welcomeMessageStyles(enrichedConfig)}
		${echoLauncherButtonStyles(enrichedConfig)}
		${savedPagesDropdownStyles(enrichedConfig)}

		/* Drawing Components */
		${drawingLayerStyles(enrichedConfig)}
		${drawingToolbarStyles(enrichedConfig)}
		${colorSelectorStyles(enrichedConfig)}
		${shapeActionsStyles(enrichedConfig)}
		${tooltipStyles(enrichedConfig)}
		
		/* Feedback Components */
		${feedbackFormStyles(enrichedConfig)}
	`
}

export const Echo: Component<EchoOptions> = props => {
	return (
		<Portal useShadow mount={document.body}>
			<EchoRoot {...props}>
				<EchoLayout />
			</EchoRoot>
		</Portal>
	)
}

const EchoRoot: Component<EchoOptions> = props => {
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

	const updateHeight = () => {
		requestAnimationFrame(() => {
			if (!props.rootRef) return

			// Temporarily set root height to 0 to measure true document height
			const originalHeight = props.rootRef.style.height
			props.rootRef.style.height = '0px'

			// Get the height without root's influence
			const height = document.documentElement.scrollHeight

			// Restore original height
			props.rootRef.style.height = originalHeight

			store.setWidget({
				dimensions: {
					width: document.documentElement.clientWidth,
					height,
				},
			})
		})
	}

	onMount(() => {
		window.addEventListener('resize', updateHeight)
		updateHeight()
	})

	onCleanup(() => {
		window.removeEventListener('resize', updateHeight)
	})

	createEffect(() => {
		const observer = new MutationObserver(() => {
			updateHeight()
		})
		observer.observe(document.documentElement, {
			childList: true,
			subtree: true,
			attributes: true,
		})
		onCleanup(() => {
			observer.disconnect()
		})
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
