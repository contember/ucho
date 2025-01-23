import { Component, Show } from 'solid-js'
import { useRootStore } from '../contexts/RootContext'
import { isMobileDevice } from '../utils/device'
import { captureScreenshot } from '../utils/screenshot'
import { ChevronRightIcon, MessageIcon } from './icons'

export const FeedbackForm: Component = () => {
	const store = useRootStore()
	const isMobile = isMobileDevice()

	const handleSubmit = async (e: SubmitEvent) => {
		e.preventDefault()

		const screenshot = await captureScreenshot({ annotations: store.drawing.shapes })

		const data = {
			comment: store.feedback.comment,
			screenshot: screenshot,
			metadata: {
				url: window.location.href,
				userAgent: navigator.userAgent,
				timestamp: new Date().toISOString(),
				browserInfo: {
					width: window.innerWidth,
					height: window.innerHeight,
					screenWidth: window.screen.width,
					screenHeight: window.screen.height,
					isMobile: isMobile,
				},
			},
		}
		await store.widget.onSubmit(data)
		store.reset()
	}

	const toggleWidget = () => {
		store.setWidget({ isOpen: !store.widget.isOpen })
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
						<div class="echo-header-buttons">
							<button
								onClick={() => store.setFeedback({ isMinimized: !store.feedback.isMinimized })}
								class="echo-minimize-button"
								title={store.feedback.isMinimized ? 'Expand' : 'Minimize'}
							>
								<ChevronRightIcon />
							</button>
							<button onClick={toggleWidget} class="echo-minimize-button" title="Close">
								×
							</button>
						</div>
					</div>

					<form onSubmit={handleSubmit}>
						<textarea
							value={store.feedback.comment}
							onInput={e => store.setFeedback({ comment: e.currentTarget.value })}
							placeholder="What's on your mind? We'd love to hear your feedback..."
							class="echo-feedback-textarea"
							required
						/>

						<Show when={store.feedback.screenshot}>
							<div class="echo-screenshot-preview">
								<img src={store.feedback.screenshot} alt="Screenshot Preview" class="echo-screenshot-image" />
							</div>
						</Show>

						<button type="submit" class="echo-submit-button">
							Send Feedback
						</button>
					</form>

					{!isMobile && (
						<button
							class="echo-maximize-feedback-button"
							onClick={() => store.setFeedback({ isMinimized: false })}
							style={{
								opacity: store.feedback.isMinimized ? '1' : '0',
								'pointer-events': store.feedback.isMinimized ? 'auto' : 'none',
							}}
							title="Show Feedback Form"
						>
							<MessageIcon stroke="white" />
						</button>
					)}
				</div>
			</div>

			{isMobile && (
				<button
					class="echo-mobile-maximize-button"
					onClick={() => store.setFeedback({ isMinimized: false })}
					style={{
						opacity: store.feedback.isMinimized && !store.drawing.isDrawing ? '1' : '0',
						'pointer-events': store.feedback.isMinimized ? 'auto' : 'none',
					}}
					title="Show Feedback Form"
				>
					<MessageIcon stroke="white" />
				</button>
			)}
		</>
	)
}
