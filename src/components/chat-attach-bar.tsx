import { type Component, createSignal } from 'solid-js'
import { Button } from '~/components/button'
import { useStore } from '~/contexts'
import { captureScreenshot } from '~/utils/screenshot'

/**
 * Shown in place of the feedback form while the drawing overlay is serving chat.
 * The overlay, the toolbar and the drawing layer are all reused as they are — only
 * the destination differs: the capture becomes an attachment instead of a submission.
 */
export const ChatAttachBar: Component = () => {
	const store = useStore()
	const [isCapturing, setIsCapturing] = createSignal(false)

	// The drawing store is shared with the feedback flow and its shapes are persisted
	// per page. Anything drawn for an attachment is ours to clean up, but whatever was
	// already there belongs to an unsubmitted feedback draft and has to come back —
	// including when the user cancels.
	const shapesBeforeAttach = store.drawing.state.shapes

	const leaveAttachMode = () => {
		store.drawing.setState({ shapes: shapesBeforeAttach, hasDrawn: shapesBeforeAttach.length > 0 }, true)
		store.widget.setState({ isOpen: false, captureMode: 'feedback' })
		store.chat?.methods.open()
	}

	const attach = async () => {
		setIsCapturing(true)
		try {
			const screenshot = await captureScreenshot()
			if (screenshot) store.chat?.methods.attach(screenshot)
		} finally {
			setIsCapturing(false)
			leaveAttachMode()
		}
	}

	return (
		// Kept out of the capture itself, like the feedback form.
		<section class="ucho-chat-attach-bar" data-hide-when-drawing="true" role="dialog" aria-label={store.widget.state.text.chat.attachTitle}>
			<p class="ucho-chat-attach-text">{store.widget.state.text.chat.attachBarText}</p>
			<div class="ucho-chat-attach-actions">
				<Button type="button" variant="secondary" size="sm" onClick={leaveAttachMode} disabled={isCapturing()}>
					{store.widget.state.text.chat.attachCancel}
				</Button>
				<Button type="button" variant="primary" size="sm" onClick={() => void attach()} disabled={isCapturing()}>
					{store.widget.state.text.chat.attachConfirm}
				</Button>
			</div>
		</section>
	)
}
