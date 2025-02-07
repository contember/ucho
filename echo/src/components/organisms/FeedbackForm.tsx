import { type Component, createEffect } from 'solid-js'
import { Button } from '~/components/atoms/Button'
import { ChevronRightIcon, XIcon } from '~/components/icons'
import { useEchoStore } from '~/contexts/EchoContext'
import { FeedbackPayload } from '~/types'
import { collectMetadata } from '~/utils/metadata'
import { captureScreenshot } from '~/utils/screenshot'

export const FeedbackForm: Component = () => {
	let textAreaRef: HTMLTextAreaElement | undefined
	const store = useEchoStore()

	const handleSubmit = async (e: SubmitEvent) => {
		e.preventDefault()

		const screenshot = await captureScreenshot()

		const data: FeedbackPayload = {
			message: store.feedback.state.message,
			screenshot: screenshot,
			metadata: collectMetadata(),
		}

		store.methods.submit(data)
	}

	const minimize = (e: MouseEvent) => {
		e.stopPropagation()
		store.feedback.setState({ isMinimized: true })
	}

	const maximize = () => {
		store.feedback.setState({ isMinimized: false })
	}

	createEffect(() => {
		if (store.widget.state.isOpen) {
			requestAnimationFrame(() => {
				textAreaRef?.focus()
			})
		}
	})

	return (
		<div
			class="echo-feedback"
			data-minimized={store.feedback.state.isMinimized}
			data-hide-when-drawing="true"
			onClick={() => store.feedback.state.isMinimized && maximize()}
			style={{ cursor: store.feedback.state.isMinimized ? 'pointer' : 'default' }}
		>
			<form class="echo-feedback-content" onSubmit={handleSubmit}>
				<div class="echo-feedback-header">
					<h3 class="echo-feedback-title">{store.widget.state.text.feedbackForm.title}</h3>
					<div class="echo-feedback-header-actions">
						<Button type="button" title="Hide form" variant="secondary" size="sm" onClick={minimize}>
							<ChevronRightIcon size={20} />
						</Button>
						<Button type="button" title="Close form" variant="secondary" size="sm" onClick={() => store.widget.setState({ isOpen: false })}>
							<XIcon size={20} />
						</Button>
					</div>
				</div>

				<textarea
					ref={textAreaRef}
					class="echo-feedback-form-textarea"
					value={store.feedback.state.message}
					placeholder={store.widget.state.text.feedbackForm.placeholder}
					onInput={e => store.feedback.setState({ message: e.currentTarget.value })}
					required
				/>

				<Button type="submit" variant="primary" size="lg" style={{ width: '100%' }}>
					{store.widget.state.text.feedbackForm.submitButton}
				</Button>
			</form>
		</div>
	)
}
