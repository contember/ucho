import { Component, Show } from 'solid-js'
import { useDrawing } from '../contexts/DrawingContext'
import { useFeedback } from '../contexts/FeedbackContext'
import { useWidget } from '../contexts/WidgetContext'
import { captureScreenshot } from '../utils/screenshot'
import { ChevronRightIcon, MessageIcon } from './icons'

export const FeedbackForm: Component = () => {
	const { primaryColor, onSubmit, toggleWidget, isOverlayVisible } = useWidget()
	const { comment, setComment, screenshot, setScreenshot, isMinimized, setIsMinimized } = useFeedback()
	const {
		state: { shapes, isSelecting },
	} = useDrawing()

	const transitionStyle = {
		transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
	}

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
				class={`echo-feedback-form ${isOverlayVisible() ? 'visible' : ''} ${isMinimized() ? 'minimized' : ''}`}
				style={{
					'pointer-events': isSelecting() ? 'none' : 'auto',
					'user-select': isSelecting() ? 'none' : 'auto',
					...transitionStyle,
					transform: isMinimized() ? 'translateX(calc(100% + 20px))' : 'translateX(0)',
					position: 'fixed',
					bottom: '60px',
					right: '0px',
					width: '20rem',
					'transform-origin': 'right center',
				}}
			>
				<div
					style={{
						background: 'white',
						'border-radius': '8px 0 0 8px',
						'box-shadow': '0 4px 12px rgba(0,0,0,0.15)',
						padding: '16px',
						width: '100%',
						position: 'relative',
					}}
				>
					<div style={{ display: 'flex', 'justify-content': 'space-between', 'align-items': 'center', 'margin-bottom': '16px' }}>
						<h3 style={{ margin: 0 }}>Send Feedback</h3>
						<button
							onClick={() => setIsMinimized(!isMinimized())}
							style={{
								background: 'transparent',
								border: 'none',
								padding: '8px',
								cursor: 'pointer',
								'border-radius': '4px',
								display: 'flex',
								'align-items': 'center',
								'justify-content': 'center',
								'margin-right': '-8px',
								'margin-top': '-8px',
								transition: 'background-color 0.2s ease',
							}}
						>
							<ChevronRightIcon />
						</button>
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

						<div style={{ 'margin-bottom': '16px' }}>
							<Show when={screenshot()}>
								<div
									style={{
										'margin-top': '8px',
										'max-height': '500px',
										'overflow-y': 'auto',
										border: '1px solid #ddd',
										'border-radius': '4px',
										padding: '4px',
										'background-color': '#f5f5f5',
									}}
								>
									<img
										src={screenshot()}
										alt="Screenshot Preview"
										style={{
											display: 'block',
											width: '100%',
											height: 'auto',
											'object-fit': 'contain',
											'border-radius': '2px',
										}}
									/>
								</div>
							</Show>
						</div>

						<button
							type="submit"
							style={{
								background: primaryColor,
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

					<button
						class="echo-maximize-feedback-button"
						onClick={() => setIsMinimized(false)}
						style={{
							position: 'absolute',
							top: '0px',
							left: '-40px',
							width: '40px',
							height: '40px',
							background: primaryColor,
							'border-radius': '8px 0 0 8px',
							'box-shadow': '0 4px 12px rgba(0,0,0,0.15)',
							display: 'flex',
							'align-items': 'center',
							'justify-content': 'center',
							cursor: 'pointer',
							...transitionStyle,
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
