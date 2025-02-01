import { type Component, JSXElement, createEffect, createSignal } from 'solid-js'
import { Portal } from 'solid-js/web'
import { EchoProvider } from '~/contexts'
import { useEchoStore } from '~/contexts/EchoContext'
import type { FullEchoConfig } from '~/types'
import { getContrastColor } from '~/utils/color'
import { registerKeyListener, registerMutationObserver, registerWindowEventListener } from '~/utils/listeners'
import staticStyles from './../styles.css?inline'
import { DrawingToolbar } from './molecules/DrawingToolbar'
import { LauncherButton } from './molecules/LauncherButton'
import { Notification } from './molecules/Notification'
import { WelcomeMessage } from './molecules/WelcomeMessage'
import { DrawingLayer } from './organisms/DrawingLayer'
import { FeedbackForm } from './organisms/FeedbackForm'

export const Echo: Component<FullEchoConfig> = props => {
	return (
		<Portal useShadow mount={document.body}>
			<EchoProvider {...props}>
				<EchoRoot>
					<EchoStyles primaryColor={props.primaryColor!} />
					<EchoInterface />
				</EchoRoot>
			</EchoProvider>
		</Portal>
	)
}

const EchoStyles: Component<{ primaryColor: string }> = props => {
	const [dynamicStyles, setDynamicStyles] = createSignal('')

	createEffect(() => {
		const css = `
				.echo-root {
					--primary-color: ${props.primaryColor};
					--primary-text-color: ${getContrastColor(props.primaryColor)};
				}
			`
		setDynamicStyles(css)
	})

	return (
		<>
			<style>
				{staticStyles}
				{dynamicStyles()}
			</style>
		</>
	)
}

const EchoInterface: Component = () => {
	const store = useEchoStore()

	return (
		<>
			<div class="echo-launcher" data-hidden={store.widget.state.isOpen}>
				<LauncherButton />
				<WelcomeMessage />
				<Notification />
			</div>

			<div class="echo-overlay" data-hidden={!store.widget.state.isOpen}>
				<FeedbackForm />
				<DrawingToolbar />
				<DrawingLayer />
			</div>
		</>
	)
}

const EchoRoot: Component<{
	children: JSXElement
}> = props => {
	let rootRef: HTMLDivElement | undefined
	const store = useEchoStore()

	const updateHeight = () => {
		requestAnimationFrame(() => {
			if (!rootRef) return

			rootRef.style.height = '0px'
			rootRef.style.height = `${document.documentElement.scrollHeight}px`
			store.widget.setState({
				dimensions: {
					width: document.documentElement.clientWidth,
					height: document.documentElement.scrollHeight,
				},
			})
		})
	}

	registerWindowEventListener({
		event: 'resize',
		callback: updateHeight,
		onMount: updateHeight,
	})

	registerKeyListener('Escape', () => {
		store.widget.setState({ isOpen: false })
	})

	registerMutationObserver({
		target: document.documentElement,
		options: {
			childList: true,
			subtree: true,
			attributes: true,
		},
		callback: () => {
			updateHeight()
		},
	})

	return (
		<div
			ref={rootRef}
			class="echo-root"
			data-drawing={store.drawing.state.isDrawing}
			style={{
				height: `${store.widget.state.dimensions.height}px`,
				width: `${store.widget.state.dimensions.width}px`,
			}}
		>
			{props.children}
		</div>
	)
}
