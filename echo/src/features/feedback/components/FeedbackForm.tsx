import type { Component } from 'solid-js'
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
							variant="secondary"
							size="sm"
							onClick={() => {
								store.feedback.setState({ comment: '' }, true)
								store.drawing.setState({ shapes: [] }, true)
							}}
							title="Clear feedback and drawings"
						>
							<TrashIcon size={20} />
						</Button>
						<Button
							variant="secondary"
							size="sm"
							onClick={() => store.feedback.setState({ isMinimized: !store.feedback.state.isMinimized })}
							title="Hide form"
						>
							<ChevronRightIcon size={20} />
						</Button>
						<Button variant="secondary" size="sm" onClick={() => store.widget.setState({ isOpen: false })} title="Close form">
							<XIcon size={20} />
						</Button>
					</div>
				</div>

				<form class="echo-feedback-form" onSubmit={handleSubmit}>
					<textarea
						value={store.feedback.state.comment}
						onInput={e => store.feedback.setState({ comment: e.currentTarget.value })}
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
				onClick={() => store.feedback.setState({ isMinimized: false })}
				title="Show form"
				data-hide-when-drawing="true"
			>
				<MessageIcon stroke="white" />
			</button>
		</>
	)
}
