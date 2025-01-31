import { type Component, JSXElement, createEffect, createSignal, onCleanup, onMount } from 'solid-js'
import { Portal } from 'solid-js/web'
import { EchoProvider } from '~/contexts'
import { useEchoStore } from '~/contexts/EchoContext'
import type { EchoOptions } from '~/types'
import { getContrastColor } from '~/utils/color'
import staticStyles from './../styles.css?inline'
import { EchoLayout } from './EchoLayout'

export const Echo: Component<EchoOptions> = props => {
	return (
		<Portal useShadow mount={document.body}>
			<EchoRoot {...props}>
				<EchoLayout />
			</EchoRoot>
		</Portal>
	)
}

const EchoRoot: Component<EchoOptions & { children: JSXElement }> = props => {
	return (
		<EchoProvider primaryColor={props.primaryColor!} onSubmit={props.onSubmit} textConfig={props.textConfig}>
			<EchoRootInner primaryColor={props.primaryColor!}>
				<EchoStyles primaryColor={props.primaryColor!} />
				{props.children}
			</EchoRootInner>
		</EchoProvider>
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

const EchoRootInner: Component<{
	primaryColor: string
	children: any
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
