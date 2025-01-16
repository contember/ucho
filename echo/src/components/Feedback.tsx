import { Component, Show } from 'solid-js'
import { useWidget } from '../contexts/WidgetContext'
import { FeedbackForm } from './FeedbackForm'
import { Overlay } from './Overlay'

export const Feedback: Component = () => {
	const { isOpen } = useWidget()

	return (
		<>
			<FeedbackForm />
			<Show when={isOpen()}>
				<Overlay />
			</Show>
		</>
	)
}
