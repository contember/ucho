import { type Component, createEffect, For, Show } from 'solid-js'
import { Button } from '~/components/button'
import { ChevronRightIcon, XIcon } from '~/components/icons'
import { CustomInput } from '~/components/custom-input'
import { TextArea } from '~/components/inputs/textarea'
import { useStore } from '~/contexts'
import { FeedbackPayload } from '~/types'
import { collectMetadata } from '~/utils/metadata'
import { captureScreenshot } from '~/utils/screenshot'

export const FeedbackForm: Component = () => {
	const store = useStore()
	let formRef: HTMLElement | undefined

	const handleSubmit = async (e: SubmitEvent) => {
		e.preventDefault()

		const screenshot = await captureScreenshot()

		const data: FeedbackPayload = {
			message: store.feedback.state.message,
			screenshot: screenshot,
			metadata: collectMetadata(),
			customInputs: store.feedback.state.customInputValues,
		}

		await store.methods.submit(data)
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
				formRef?.querySelector<HTMLTextAreaElement>('.ucho-input-field')?.focus()
			})
		}
	})

	return (
		<section
			ref={formRef}
			class="ucho-feedback"
			data-minimized={store.feedback.state.isMinimized}
			data-hide-when-drawing="true"
			onClick={() => store.feedback.state.isMinimized && maximize()}
			style={{ cursor: store.feedback.state.isMinimized ? 'pointer' : 'default' }}
			role="dialog"
			aria-label="Feedback Form"
			aria-expanded={!store.feedback.state.isMinimized}
		>
			<form class="ucho-feedback-content" onSubmit={handleSubmit} aria-label="Submit Feedback">
				<header class="ucho-feedback-header">
					<h3 class="ucho-feedback-title" id="feedback-form-title">
						{store.widget.state.text.feedbackForm.title}
					</h3>
					<div class="ucho-feedback-header-actions" role="toolbar" aria-label="Form controls">
						<Button type="button" title="Hide form" variant="secondary" size="sm" onClick={minimize} aria-label="Minimize feedback form">
							<ChevronRightIcon size={20} />
						</Button>
						<Button
							type="button"
							title="Close form"
							variant="secondary"
							size="sm"
							onClick={() => store.widget.setState({ isOpen: false })}
							aria-label="Close feedback form"
						>
							<XIcon size={20} />
						</Button>
					</div>
				</header>

				<fieldset class="ucho-input-options-wrapper">
					<legend class="visually-hidden">Feedback Message</legend>
					<TextArea
						config={{
							type: 'textarea',
							id: 'message',
							placeholder: store.widget.state.text.feedbackForm.placeholder,
							label: 'Feedback Message',
							required: true,
						}}
						value={store.feedback.state.message}
						onChange={value => store.feedback.setState({ message: value })}
					/>
				</fieldset>

				<Show when={store.widget.state.customInputs?.length}>
					<fieldset class="ucho-input-options-wrapper">
						<legend class="visually-hidden">Additional Information</legend>
						<For each={store.widget.state.customInputs}>
							{input => (
								<CustomInput
									config={input}
									value={store.feedback.state.customInputValues[input.id]}
									onChange={value => store.feedback.setState({ customInputValues: { ...store.feedback.state.customInputValues, [input.id]: value } })}
								/>
							)}
						</For>
					</fieldset>
				</Show>

				<footer class="ucho-feedback-footer">
					<Button type="submit" variant="primary" size="lg" style={{ width: '100%' }} aria-label="Submit feedback">
						{store.widget.state.text.feedbackForm.submitButton}
					</Button>
				</footer>
			</form>
		</section>
	)
}
