import { type Component, JSXElement, createEffect, createSignal, onCleanup, onMount } from 'solid-js'
import { Portal } from 'solid-js/web'
import { EchoProvider, useEchoStore } from '~/contexts'
import { usePageHeight } from '~/hooks/usePageHeight'
import type { FullEchoConfig } from '~/types'
import { getContrastColor } from '~/utils'
import { cleanupConsole, setupConsole } from '~/utils/console'
import { patchEventTarget, unpatchEventTarget } from '~/utils/monkeyPatch'
import staticStyles from './../styles.css?inline'
import { DrawingToolbar, LauncherButton, Notification, WelcomeMessage } from './molecules'
import { DrawingLayer, FeedbackForm } from './organisms'

export const Echo: Component<FullEchoConfig> = props => {
	return (
		<Portal useShadow mount={document.body}>
			<EchoProvider {...props}>
				<EchoRoot>
					<EchoStyles primaryColor={props.primaryColor} />
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
	let dialogRef: HTMLDialogElement | undefined

	createEffect(() => {
		if (dialogRef && store.widget.state.isOpen) {
			dialogRef.showModal()
		} else {
			dialogRef?.close()
		}
	})

	return (
		<>
			<div class="echo-launcher" data-hidden={store.widget.state.isOpen}>
				<LauncherButton />
				<WelcomeMessage />
				<Notification />
			</div>

			<EchoOverlay>
				<FeedbackForm />
				<DrawingToolbar />
				<DrawingLayer />
			</EchoOverlay>
		</>
	)
}

const EchoOverlay: Component<{ children: JSXElement }> = props => {
	const [dialogRef, setDialogRef] = createSignal<HTMLDialogElement>()
	const store = useEchoStore()

	/* dimensions sync */
	const dimensions = usePageHeight(() => dialogRef())
	createEffect(() => {
		if (dialogRef()) {
			store.widget.setState({
				dimensions: dimensions(),
			})
		}
	})

	/* dialog open/close sync */
	createEffect(() => {
		if (store.widget.state.isOpen) dialogRef()?.showModal()
		else dialogRef()?.close()
	})

	return (
		<dialog
			ref={setDialogRef}
			class="echo-overlay"
			style={{
				height: `${dimensions().height}px`,
				width: `${dimensions().width}px`,
			}}
			data-hidden={!store.widget.state.isOpen}
			onClose={() => store.widget.setState({ isOpen: false })}
		>
			{props.children}
		</dialog>
	)
}

const EchoRoot: Component<{
	children: JSXElement
}> = props => {
	const store = useEchoStore()

	onMount(() => {
		setupConsole()
		patchEventTarget(e => {
			if (!store.widget.state.isOpen) return

			if (e.type === 'keydown') {
				const keyEvent = e as KeyboardEvent
				switch (keyEvent.key) {
					case 'Escape':
						e.stopImmediatePropagation()
						break
				}
			}
		})
	})

	onCleanup(() => {
		cleanupConsole()
		unpatchEventTarget()
	})

	return (
		<div class="echo-root" data-drawing={store.drawing.state.isDrawing}>
			{props.children}
		</div>
	)
}
