import { Component } from 'solid-js'
import { Button } from '~/components/atoms/Button'
import { ChevronRightIcon, MessageIcon, TrashIcon, XIcon } from '~/components/icons'
import { useEchoStore } from '~/contexts/EchoContext'
import { isMobileDevice } from '~/utils'
import { getConsoleBuffer } from '~/utils/console'
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
			await store.widget.onSubmit({
				...data,
				console: getConsoleBuffer(),
			})
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
						<Button
							variant="secondary"
							size="sm"
							onClick={() => {
								store.setFeedback({ comment: '' }, true)
								store.setDrawing({ shapes: [] }, true)
							}}
							title="Clear feedback and drawings"
						>
							<TrashIcon size={20} />
						</Button>
						<Button variant="secondary" size="sm" onClick={() => store.setFeedback({ isMinimized: !store.feedback.isMinimized })} title="Hide form">
							<ChevronRightIcon size={20} />
						</Button>
						<Button variant="secondary" size="sm" onClick={() => store.setWidget({ isOpen: false })} title="Close form">
							<XIcon size={20} />
						</Button>
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

					<Button type="submit" variant="primary" size="lg" style={{ width: '100%' }}>
						{store.text.feedbackForm.submitButton}
					</Button>
				</form>
			</div>

			{/* Maximize button */}
			<button
				class="echo-feedback-maximize"
				onClick={() => store.setFeedback({ isMinimized: false })}
				title="Show form"
				data-hide-when-drawing="true"
			>
				<MessageIcon stroke="white" />
			</button>
		</>
	)
}
