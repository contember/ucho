import type { Component } from 'solid-js'
import { DrawingLayer, DrawingToolbar } from '~/features/drawing'
import type { Position } from '~/types'
import { EchoLauncherButton } from '../features/launcher/components/EchoLauncherButton'
import { Notification } from '../features/launcher/components/Notification'
import { WelcomeMessage } from '../features/launcher/components/WelcomeMessage'
import { Launcher } from './Launcher'
import { Overlay } from './Overlay'
import { FeedbackForm } from './organisms/FeedbackForm'

interface EchoLayoutProps {
	position?: Position
}

export const EchoLayout: Component<EchoLayoutProps> = props => {
	return (
		<>
			<Launcher>
				<EchoLauncherButton />
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
