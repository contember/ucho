import { type Component, createEffect, createMemo, createSignal, JSXElement, onCleanup, onMount } from 'solid-js'
import { Portal } from 'solid-js/web'
import { Provider, useStore } from '~/contexts'
import { usePageHeight } from '~/hooks/page-height-hooks'
import { usePageStateSync } from '~/hooks/page-state-sync-hooks'
import type { FullConfig } from '~/types'
import { getContrastColor } from '~/utils'
import { cleanupConsole, setupConsole } from '~/utils/console'
import staticStyles from './../styles.css?inline'
import { DrawingLayer } from './drawing-layer'
import { DrawingToolbar } from './drawing-toolbar'
import { FeedbackForm } from './feedback-form'
import { LauncherButton } from './launcher-button'
import { Notification } from './notification'
import { WelcomeMessage } from './welcome-message'

export const Ucho: Component<FullConfig> = props => {
	return (
		<Portal useShadow mount={document.body}>
			<Provider {...props}>
				<Root>
					<UchoStyles primaryColor={props.primaryColor} />
					<UchoInterface />
				</Root>
			</Provider>
		</Portal>
	)
}

const UchoStyles: Component<{ primaryColor: string }> = props => {
	const dynamicStyles = createMemo(() => `
		.ucho-root {
			--primary-color: ${props.primaryColor};
			--primary-text-color: ${getContrastColor(props.primaryColor)};
		}
	`)

	return (
		<style>
			{staticStyles}
			{dynamicStyles()}
		</style>
	)
}

const UchoInterface: Component = () => {
	const store = useStore()

	return (
		<>
			<div
				class="ucho-launcher"
				style={{
					...(store.widget.state.position.includes('top') ? { top: 'var(--spacing-xl)' } : { bottom: 'var(--spacing-xl)' }),
					...(store.widget.state.position.includes('left') ? { left: 'var(--spacing-xl)' } : { right: 'var(--spacing-xl)' }),
				}}
				data-hidden={store.widget.state.isOpen}
			>
				<LauncherButton />
				<WelcomeMessage />
				<Notification />
			</div>

			<UchoOverlay>
				<FeedbackForm />
				<DrawingToolbar />
				<DrawingLayer />
			</UchoOverlay>
		</>
	)
}

const UchoOverlay: Component<{ children: JSXElement }> = props => {
	const [dialogRef, setDialogRef] = createSignal<HTMLDialogElement>()
	const store = useStore()

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
			class="ucho-overlay"
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

const Root: Component<{
	children: JSXElement
}> = props => {
	const store = useStore()

	usePageStateSync({
		onUrlChange: newPageKey => store.methods.handlePageChange(newPageKey),
	})

	onMount(() => {
		setupConsole()
	})

	onCleanup(() => {
		cleanupConsole()
	})

	return (
		<div class="ucho-root" data-drawing={store.drawing.state.isDrawing} data-position={store.widget.state.position}>
			{props.children}
		</div>
	)
}
