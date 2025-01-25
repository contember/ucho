import { Component } from 'solid-js'
import { ChevronRightIcon, MessageIcon, TrashIcon } from '~/components/icons'
import { useEchoStore } from '~/contexts/EchoContext'
import { isMobileDevice } from '~/utils'
import { captureScreenshot } from '~/utils/screenshot'

export const FeedbackForm: Component = () => {
	const store = useEchoStore()
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

		try {
			store.setWidget({ isOpen: false })
			await store.widget.onSubmit(data)
			store.methods.postSubmit({ show: true, type: 'success', message: '' })
		} catch (error) {
			store.methods.postSubmit({ show: true, type: 'error', message: store.text.notification.errorMessage })
		}
	}

	return (
		<>
			<div class="echo-feedback" data-minimized={store.feedback.isMinimized} data-hide-when-drawing="true">
				<div class="echo-feedback-header">
					<h3 class="echo-feedback-title">{store.text.feedbackForm.title}</h3>
					<div class="echo-feedback-header-actions">
						<button
							type="button"
							class="echo-feedback-header-action"
							title="Clear feedback and drawings"
							onClick={() => {
								store.setFeedback({ comment: '' })
								store.setDrawing({ shapes: [] })
							}}
						>
							<TrashIcon size={16} />
						</button>
						<button
							onClick={() => store.setFeedback({ isMinimized: !store.feedback.isMinimized })}
							class="echo-feedback-header-action"
							title="Hide form"
						>
							<ChevronRightIcon />
						</button>
						<button onClick={() => store.setWidget({ isOpen: false })} class="echo-feedback-header-action" title="Close form">
							×
						</button>
					</div>
				</div>

				<form class="echo-feedback-form" onSubmit={handleSubmit}>
					<textarea
						value={store.feedback.comment}
						onInput={e => store.setFeedback({ comment: e.currentTarget.value })}
						placeholder={store.text.feedbackForm.placeholder}
						class="echo-feedback-form-textarea"
						required
					/>

					<button type="submit" class="echo-feedback-form-submit">
						{store.text.feedbackForm.submitButton}
					</button>
				</form>
			</div>

			{/* Maximize button */}
			<button
				class="echo-feedback-maximize"
				title="Show form"
				onClick={() => store.setFeedback({ isMinimized: false })}
				data-hide-when-drawing="true"
			>
				<MessageIcon stroke="white" />
			</button>
		</>
	)
}
