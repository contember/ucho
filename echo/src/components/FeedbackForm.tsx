import { Component } from 'solid-js'
import { useDrawing } from '../contexts/DrawingContext'
import { useFeedback } from '../contexts/FeedbackContext'
import { useWidget } from '../contexts/WidgetContext'
import { captureScreenshot } from '../utils/screenshot'
import { ChevronRightIcon, MessageIcon } from './icons'

export const FeedbackForm: Component = () => {
	const { onSubmit, toggleWidget, isOpenStaggered } = useWidget()
	const { comment, setComment, screenshot, setScreenshot, isMinimized, setIsMinimized } = useFeedback()
	const {
		state: { shapes, isDrawing },
	} = useDrawing()

	const handleSubmit = async (e: SubmitEvent) => {
		e.preventDefault()

		if (shapes().length > 0) {
			const newScreenshot = await captureScreenshot({ annotations: shapes() })
			if (newScreenshot) {
				setScreenshot(newScreenshot)
			}
		}

		const data = {
			comment: comment(),
			screenshot: screenshot(),
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
		await onSubmit(data)
		toggleWidget()
	}

	return (
		<>
			<div
				class={`echo-feedback-form ${isOpenStaggered() ? 'visible' : ''} ${isMinimized() ? 'minimized' : ''}`}
				data-hidden={isDrawing()}
				data-minimized={isMinimized()}
			>
				<div class="echo-feedback-container">
					<div class="echo-feedback-header">
						<h3 class="echo-feedback-title">Send Feedback</h3>
						<button onClick={() => setIsMinimized(!isMinimized())} class="echo-minimize-button">
							<ChevronRightIcon />
						</button>
					</div>

					<form onSubmit={handleSubmit}>
						<textarea
							value={comment()}
							onInput={e => setComment(e.currentTarget.value)}
							placeholder="What's on your mind?"
							class="echo-feedback-textarea"
						/>

						<button type="submit" class="echo-submit-button">
							Send Feedback
						</button>
					</form>

					<button
						class="echo-maximize-feedback-button"
						onClick={() => setIsMinimized(false)}
						style={{
							opacity: isMinimized() ? '1' : '0',
							'pointer-events': isMinimized() ? 'auto' : 'none',
						}}
					>
						<MessageIcon stroke="white" />
					</button>
				</div>
			</div>
		</>
	)
}
