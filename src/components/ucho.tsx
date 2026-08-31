import { type Component, createEffect, createMemo, createSignal, JSXElement, onCleanup, onMount, Show } from 'solid-js'
import { Portal } from 'solid-js/web'
import { Provider, useStore } from '~/contexts'
import { usePageHeight } from '~/hooks/page-height-hooks'
import { usePageStateSync } from '~/hooks/page-state-sync-hooks'
import type { FullConfig } from '~/types'
import { getContrastColor } from '~/utils'
import { cleanupConsole, setupConsole } from '~/utils/console'
import staticStyles from './../styles.css?inline'
import { ChatAttachBar } from './chat-attach-bar'
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
					// Both sides of each axis are set: the stylesheet pins `bottom` and `right`,
					// so setting only the opposite one leaves this fixed element
					// over-constrained and stretched to the full viewport — which puts
					// anything anchored to it (the chat panel, stored feedback) off-screen.
					...(store.widget.state.position.includes('top')
						? { top: 'var(--spacing-xl)', bottom: 'auto' }
						: { bottom: 'var(--spacing-xl)', top: 'auto' }),
					...(store.widget.state.position.includes('left')
						? { left: 'var(--spacing-xl)', right: 'auto' }
						: { right: 'var(--spacing-xl)', left: 'auto' }),
				}}
				data-hidden={store.widget.state.isOpen}
			>
				<LauncherButton />
				<WelcomeMessage />
				<Notification />
			</div>

			<UchoOverlay>
				<Show
					when={store.widget.state.captureMode === 'chat'}
					fallback={<Show when={store.methods.hasFeedback()}>{<FeedbackForm />}</Show>}
				>
					<ChatAttachBar />
				</Show>
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
			onClose={() => {
				// Escape and the backdrop both land here, and they are the only other ways
				// out of attach mode — without this the overlay keeps showing the attach bar
				// instead of the feedback form for the rest of the session.
				store.widget.setState({ isOpen: false, captureMode: 'feedback' })
			}}
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
