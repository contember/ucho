import type { Component, JSX } from 'solid-js'
import { useEchoStore } from '~/contexts'

export const Overlay: Component<{ children: JSX.Element }> = props => {
	const store = useEchoStore()

	return (
		<div class="echo-overlay" data-hidden={!store.widget.isOpen}>
			{props.children}
		</div>
	)
}
