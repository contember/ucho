import type { Component } from 'solid-js'
import { Button } from '~/components/atoms/Button'
import { ChevronRightIcon, MessageIcon, XIcon } from '~/components/icons'
import { useEchoStore } from '~/contexts/EchoContext'
import { isMobileDevice } from '~/utils'
import { getConsoleBuffer } from '~/utils/console'
import { captureScreenshot } from '~/utils/screenshot'

export const FeedbackForm: Component = () => {
	const store = useEchoStore()
	const isMobile = isMobileDevice()

	const handleSubmit = async (e: SubmitEvent) => {
		e.preventDefault()

		const screenshot = await captureScreenshot({ annotations: store.drawing.state.shapes })

		const data = {
			comment: store.feedback.state.comment,
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
			store.widget.setState({ isOpen: false })
			await store.widget.methods.onSubmit({
				...data,
				console: getConsoleBuffer(),
			})
			store.widget.methods.postSubmit({ show: true, type: 'success', message: '' })
		} catch (error) {
			store.widget.methods.postSubmit({ show: true, type: 'error', message: store.text.notification.errorMessage })
		}
	}

	return (
		<>
			<div class="echo-feedback" data-minimized={store.feedback.state.isMinimized} data-hide-when-drawing="true">
				<div class="echo-feedback-header">
					<h3 class="echo-feedback-title">{store.text.feedbackForm.title}</h3>
					<div class="echo-feedback-header-actions">
						<Button
							title="Hide form"
							variant="secondary"
							size="sm"
							onClick={() => store.feedback.setState({ isMinimized: !store.feedback.state.isMinimized })}
						>
							<ChevronRightIcon size={20} />
						</Button>
						<Button title="Close form" variant="secondary" size="sm" onClick={() => store.widget.setState({ isOpen: false })}>
							<XIcon size={20} />
						</Button>
					</div>
				</div>

				<form class="echo-feedback-form" onSubmit={handleSubmit}>
					<textarea
						class="echo-feedback-form-textarea"
						value={store.feedback.state.comment}
						placeholder={store.text.feedbackForm.placeholder}
						onInput={e => store.feedback.setState({ comment: e.currentTarget.value })}
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
				title="Show form"
				data-hide-when-drawing="true"
				onClick={() => store.feedback.setState({ isMinimized: false })}
			>
				<MessageIcon stroke="white" />
			</button>
		</>
	)
}
