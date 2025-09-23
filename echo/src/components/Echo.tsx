import { type Component, JSXElement, createEffect, createSignal, onCleanup, onMount } from 'solid-js'
import { Portal } from 'solid-js/web'
import { EchoProvider, useEchoStore } from '~/contexts'
import { usePageHeight } from '~/hooks/usePageHeight'
import { usePageStateSync } from '~/hooks/usePageStateSync'
import type { FullEchoConfig } from '~/types'
import { getContrastColor } from '~/utils'
import { cleanupConsole, setupConsole } from '~/utils/console'
import { setShadowRoot } from '~/utils/monkeyPatch'
import staticStyles from './../styles.css?inline'
import { DrawingToolbar, LauncherButton, Notification, WelcomeMessage } from './molecules'
import { DrawingLayer, FeedbackForm } from './organisms'

export const Echo: Component<FullEchoConfig> = props => {
	const [shadowRootRef, setShadowRootRef] = createSignal<HTMLElement>()

	createEffect(() => {
		const root = shadowRootRef()
		if (root) {
			setShadowRoot(root.shadowRoot)
		}
	})

	return (
		<Portal ref={setShadowRootRef} useShadow mount={document.body}>
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

	return (
		<>
			<div
				class="echo-launcher"
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

// const handlePatchedEventWhenOpen = (e: Event) => {
// 	switch (e.type) {
// 		default:
// 			e.stopImmediatePropagation()
// 			break
// 	}
// }

// const handlePatchedEventWhenClosed = (e: Event) => {
// 	switch (e.type) {
// 		case 'dismissableLayer.focusOutside':
// 		case 'dismissableLayer.pointerDownOutside':
// 			e.stopImmediatePropagation()
// 			break
// 		default:
// 			break
// 	}
// }

const EchoRoot: Component<{
	children: JSXElement
}> = props => {
	const store = useEchoStore()

	usePageStateSync({
		onUrlChange: newPageKey => store.methods.handlePageChange(newPageKey),
	})

	onMount(() => {
		setupConsole()

		// patchEventTarget(e => {
		// 	/* some events are document-wide or window-wide */
		// 	if (e.target instanceof Document || e.target instanceof Window) {
		// 		return
		// 	}

		// 	/* ignore events targeting elements that contain the shadow root */
		// 	if (e.target instanceof Element && e.target.shadowRoot && isNodeInEchoShadowRoot(e.target.shadowRoot)) {
		// 		return
		// 	}

		// 	/* ignore events targeting stuff inside the echo shadow root */
		// 	if (e.target instanceof Node && isNodeInEchoShadowRoot(e.target)) {
		// 		return
		// 	}

		// 	// Process the event based on widget state
		// 	// if (store.widget.state.isOpen) {
		// 	// 	console.log('intercepted event', e.type, e.target)
		// 	// 	handlePatchedEventWhenOpen(e)
		// 	// } else {
		// 	// 	if (e.type === 'mousemove' || e.type === 'pointermove') return
		// 	// 	console.log('intercepted event', e.type)
		// 	// 	handlePatchedEventWhenClosed(e)
		// 	// }
		// })
	})

	onCleanup(() => {
		cleanupConsole()
		// unpatchEventTarget()
	})

	return (
		<div class="echo-root" data-drawing={store.drawing.state.isDrawing}>
			{props.children}
		</div>
	)
}
