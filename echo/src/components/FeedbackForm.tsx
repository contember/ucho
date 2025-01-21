import { Component } from 'solid-js'
import { useRootStore } from '../contexts/RootContext'
import { captureScreenshot } from '../utils/screenshot'
import { ChevronRightIcon, MessageIcon } from './icons'

export const FeedbackForm: Component = () => {
	const store = useRootStore()

	const handleSubmit = async (e: SubmitEvent) => {
		e.preventDefault()

		if (store.drawing.shapes.length > 0) {
			const newScreenshot = await captureScreenshot({ annotations: store.drawing.shapes })
			if (newScreenshot) {
				store.setFeedback({ screenshot: newScreenshot })
			}
		}

		const data = {
			comment: store.feedback.comment,
			screenshot: store.feedback.screenshot,
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
		await store.widget.onSubmit(data)
		store.setWidget({ isOpen: false })
	}

	return (
		<>
			<div
				class={`echo-feedback-form ${store.widget.isOpen ? 'visible' : ''} ${store.feedback.isMinimized ? 'minimized' : ''}`}
				data-hidden={store.drawing.isDrawing}
				data-minimized={store.feedback.isMinimized}
			>
				<div class="echo-feedback-container">
					<div class="echo-feedback-header">
						<h3 class="echo-feedback-title">Send Feedback</h3>
						<button onClick={() => store.setFeedback({ isMinimized: !store.feedback.isMinimized })} class="echo-minimize-button">
							<ChevronRightIcon />
						</button>
					</div>

					<form onSubmit={handleSubmit}>
						<textarea
							value={store.feedback.comment}
							onInput={e => store.setFeedback({ comment: e.currentTarget.value })}
							placeholder="What's on your mind?"
							class="echo-feedback-textarea"
						/>

						<button type="submit" class="echo-submit-button">
							Send Feedback
						</button>
					</form>

					<button
						class="echo-maximize-feedback-button"
						onClick={() => store.setFeedback({ isMinimized: false })}
						style={{
							opacity: store.feedback.isMinimized ? '1' : '0',
							'pointer-events': store.feedback.isMinimized ? 'auto' : 'none',
						}}
					>
						<MessageIcon stroke="white" />
					</button>
				</div>
			</div>
		</>
	)
}
