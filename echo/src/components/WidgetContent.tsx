import { Component } from 'solid-js'
import { FeedbackForm } from '~/components/FeedbackForm'
import { Notification } from '~/components/Notification'
import { Overlay } from '~/components/Overlay'
import { WelcomeMessage } from '~/components/WelcomeMessage'
import { WidgetButton } from '~/components/WidgetButton'
import { useRootStore } from '~/contexts'

export const WidgetContent: Component = () => {
	const store = useRootStore()

	return (
		<div class="echo-widget">
			<WidgetButton />
			<WelcomeMessage />
			<Notification />

			<div class="echo-widget-content" data-hidden={!store.widget.isOpen}>
				<FeedbackForm />
				<Overlay />
			</div>
		</div>
	)
}
