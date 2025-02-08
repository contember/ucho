import { type Component, For, Show, createEffect } from 'solid-js'
import { Button } from '~/components/atoms/Button'
import { TextArea } from '~/components/atoms/inputs/TextArea'
import { ChevronRightIcon, XIcon } from '~/components/icons'
import { CustomInput } from '~/components/molecules/CustomInput'
import { useEchoStore } from '~/contexts/EchoContext'
import { FeedbackPayload } from '~/types'
import { collectMetadata } from '~/utils/metadata'
import { captureScreenshot } from '~/utils/screenshot'

export const FeedbackForm: Component = () => {
	const store = useEchoStore()

	const handleSubmit = async (e: SubmitEvent) => {
		e.preventDefault()

		const screenshot = await captureScreenshot()

		const data: FeedbackPayload = {
			message: store.feedback.state.message,
			screenshot: screenshot,
			metadata: collectMetadata(),
			customInputs: store.feedback.state.customInputValues,
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
				document.querySelector<HTMLTextAreaElement>('.echo-input-field')?.focus()
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

				<TextArea
					config={{
						type: 'textarea',
						id: 'message',
						placeholder: store.widget.state.text.feedbackForm.placeholder,
					}}
					value={store.feedback.state.message}
					onChange={value => store.feedback.setState({ message: value })}
				/>

				<Show when={store.widget.state.customInputs?.length}>
					<div class="echo-inputs">
						<For each={store.widget.state.customInputs}>
							{input => (
								<CustomInput
									config={input}
									value={store.feedback.state.customInputValues[input.id]}
									onChange={value => store.feedback.setState({ customInputValues: { ...store.feedback.state.customInputValues, [input.id]: value } })}
								/>
							)}
						</For>
					</div>
				</Show>

				<Button type="submit" variant="primary" size="lg" style={{ width: '100%' }}>
					{store.widget.state.text.feedbackForm.submitButton}
				</Button>
			</form>
		</div>
	)
}
