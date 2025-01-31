import { type Component, type JSX, onCleanup, onMount } from 'solid-js'
import { useEchoStore } from '~/contexts'
export const Overlay: Component<{ children: JSX.Element }> = props => {
	const store = useEchoStore()

	const handleKeyDown = (e: KeyboardEvent) => {
		if (e.key === 'Escape') {
			store.widget.setState({ isOpen: false })
		}
	}

	onMount(() => {
		window.addEventListener('keydown', handleKeyDown)
	})

	onCleanup(() => {
		window.removeEventListener('keydown', handleKeyDown)
	})

	return (
		<div class="echo-overlay" data-hidden={!store.widget.state.isOpen}>
			{props.children}
		</div>
	)
}
