import { type Component, createEffect, Show } from 'solid-js'
import { Button } from '~/components/button'
import { XIcon } from '~/components/icons'
import { useStore } from '~/contexts'

/**
 * A screenshot from the transcript, at the size it was taken.
 *
 * The panel is 360px wide and what arrives in it is usually a whole viewport with one
 * thing circled, so inline it lands at about a quarter of the size of what it is pointing
 * at. Opening it is the difference between having the screenshot and being able to read it.
 *
 * This is the one modal thing in a flow that is deliberately not modal. `showModal()` is
 * what puts it in the top layer, which is the only way to sit above a host page whose own
 * chrome may stack arbitrarily high, and it brings Escape, focus containment and a
 * backdrop along with it. The trade is sound only because the user opened it by clicking
 * and every ordinary way out (Escape, the backdrop, the button) closes it again.
 *
 * It renders as a sibling of the panel rather than inside it: `.ucho-popover` animates on
 * open, and an ancestor mid-transform becomes the containing block for a fixed-position
 * descendant, which would leave this hanging off the panel instead of the viewport.
 */
export const ChatLightbox: Component = () => {
	const store = useStore()
	const chat = store.chat
	if (!chat) return null

	let dialogRef: HTMLDialogElement | undefined

	const image = () => chat.state.viewedImage

	createEffect(() => {
		const current = image()
		if (!dialogRef) return
		if (current && !dialogRef.open) dialogRef.showModal()
		else if (!current && dialogRef.open) dialogRef.close()
	})

	return (
		<dialog
			ref={dialogRef}
			class="ucho-lightbox"
			aria-label={image()?.label ?? store.widget.state.text.chat.attachmentLabel}
			// Escape and the backdrop both end up here. The state has to follow, or the
			// dialog closes while the store still believes it is open and the same
			// screenshot can never be opened again.
			onClose={() => chat.methods.closeImage()}
			onClick={event => {
				// A click that lands on the dialog itself landed on the backdrop: the image
				// and the button are children, and a click on either stops at them.
				if (event.target === dialogRef) chat.methods.closeImage()
			}}
		>
			<Show when={image()}>
				{current => (
					// The button hangs off the image rather than off the viewport: the panel is
					// still on screen behind this, and a viewport corner is exactly where its own
					// close button already is.
					<figure class="ucho-lightbox-frame">
						<img class="ucho-lightbox-image" src={current().url} alt={current().label} />
						<Button
							class="ucho-lightbox-close"
							variant="secondary"
							size="sm"
							title={store.widget.state.text.chat.closeImageTitle}
							aria-label={store.widget.state.text.chat.closeImageTitle}
							onClick={() => chat.methods.closeImage()}
						>
							<XIcon size={18} />
						</Button>
					</figure>
				)}
			</Show>
		</dialog>
	)
}
