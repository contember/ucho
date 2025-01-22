import { Component, Show } from 'solid-js'
import { useRootStore } from '../contexts/RootContext'
import { FeedbackForm } from './FeedbackForm'
import { Overlay } from './Overlay'
import { WelcomeMessage } from './WelcomeMessage'
import { WidgetButton } from './WidgetButton'

export const WidgetContent: Component = () => {
	const store = useRootStore()

	return (
		<div class="echo-widget">
			<WidgetButton />
			<WelcomeMessage />

			<Show when={store.widget.isOpen}>
				<FeedbackForm />
				<Overlay />
			</Show>
		</div>
	)
}
