import { Component } from 'solid-js'
import { createSignal } from 'solid-js'
import { FeedbackData } from '../types'

interface FeedbackFormProps {
	onClose: () => void
	onSubmit: (data: FeedbackData) => void | Promise<void>
	primaryColor: string
}

export const FeedbackForm: Component<FeedbackFormProps> = props => {
	const [comment, setComment] = createSignal('')

	const handleSubmit = async (e: SubmitEvent) => {
		e.preventDefault()
		const data: FeedbackData = {
			comment: comment(),
			metadata: {
				url: window.location.href,
				userAgent: navigator.userAgent,
				timestamp: new Date().toISOString(),
				browserInfo: {
					width: window.innerWidth,
					height: window.innerHeight,
					screenWidth: window.screen.width,
					screenHeight: window.screen.height,
				},
			},
		}
		await props.onSubmit(data)
		props.onClose()
	}

	return (
		<div
			style={{
				background: 'white',
				'border-radius': '8px',
				'box-shadow': '0 4px 12px rgba(0,0,0,0.15)',
				padding: '16px',
				width: '320px',
			}}
		>
			<div style={{ display: 'flex', 'justify-content': 'space-between', 'margin-bottom': '16px' }}>
				<h3 style={{ margin: 0 }}>Send Feedback</h3>
			</div>

			<form onSubmit={handleSubmit}>
				<textarea
					value={comment()}
					onInput={e => setComment(e.currentTarget.value)}
					placeholder="What's on your mind?"
					style={{
						width: '100%',
						height: '100px',
						padding: '8px',
						'margin-bottom': '16px',
						'border-radius': '4px',
						border: '1px solid #ddd',
						resize: 'vertical',
					}}
				/>

				<button
					type="submit"
					style={{
						background: props.primaryColor,
						color: 'white',
						border: 'none',
						padding: '8px 16px',
						'border-radius': '4px',
						cursor: 'pointer',
						width: '100%',
					}}
				>
					Send Feedback
				</button>
			</form>
		</div>
	)
}
