import { Component, Show } from 'solid-js'
import { useWidget } from '../contexts/WidgetContext'
import { FeedbackForm } from './FeedbackForm'
import { Overlay } from './Overlay'
import { WidgetButton } from './WidgetButton'

export const WidgetContent: Component = () => {
	const { isOpen } = useWidget()

	return (
		<div class="echo-widget">
			<WidgetButton />

			<Show when={isOpen()}>
				<FeedbackForm />
				<Overlay />
			</Show>
		</div>
	)
}
