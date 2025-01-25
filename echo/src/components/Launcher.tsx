import { Component, JSXElement } from 'solid-js'
import { useEchoStore } from '~/contexts'

interface LauncherProps {
	children: JSXElement
}

export const Launcher: Component<LauncherProps> = props => {
	const store = useEchoStore()

	return (
		<div class="echo-launcher" data-hidden={store.widget.isOpen}>
			{props.children}
		</div>
	)
}
