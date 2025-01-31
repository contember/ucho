import type { Component } from 'solid-js'
import type { Position } from '~/types'
import { Launcher } from './Launcher'
import { Overlay } from './Overlay'
import { DrawingToolbar } from './molecules/DrawingToolbar'
import { EchoLauncherButton } from './molecules/EchoLauncherButton'
import { Notification } from './molecules/Notification'
import { WelcomeMessage } from './molecules/WelcomeMessage'
import { DrawingLayer } from './organisms/DrawingLayer'
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
