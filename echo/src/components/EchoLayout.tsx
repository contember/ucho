import { Component } from 'solid-js'
import { DrawingLayer, DrawingToolbar } from '~/features/drawing'
import { FeedbackForm } from '~/features/feedback'
import { EchoButton } from '../features/launcher/components/EchoButton'
import { Notification } from '../features/launcher/components/Notification'
import { WelcomeMessage } from '../features/launcher/components/WelcomeMessage'
import { Launcher } from './Launcher'
import { Overlay } from './Overlay'

export const EchoLayout: Component = () => {
	return (
		<>
			<Launcher>
				<EchoButton />
				<WelcomeMessage />
				<Notification />
			</Launcher>

			<Overlay>
				<FeedbackForm />
				<DrawingToolbar />
				<DrawingLayer />
			</Overlay>
		</>
	)
}
