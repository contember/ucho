import { type Component, createMemo, createSignal, For, Show } from 'solid-js'
import { Button } from '~/components/button'
import { XIcon } from '~/components/icons'
import { ExternalLinkIcon } from '~/components/icons/external-link-icon'
import { useStore } from '~/contexts'
import { registerMutationObserver, registerWindowEventListener } from '~/utils/listeners'
import { clearPageState, getStoredPages } from '~/utils/storage'

export const StoredFeedback: Component = () => {
	const store = useStore()
	let dialogRef: HTMLDivElement | undefined
	const [pages, setPages] = createSignal(getStoredPages())
	const [currentPath, setCurrentPath] = createSignal(window.location.pathname)

	const handleEscapeKey = (event: KeyboardEvent) => {
		if (event.key === 'Escape' && store.widget.state.isStoredFeedbackOpen) {
			store.widget.setState({ isStoredFeedbackOpen: false })
		}
	}

	const handleOutsideClick = (event: MouseEvent) => {
		if (!store.widget.state.isStoredFeedbackOpen || !dialogRef) return

		const path = event.composedPath()
		if (!path.includes(dialogRef)) {
			store.widget.setState({ isStoredFeedbackOpen: false })
		}
	}

	const handleStorageChange = () => {
		const storedPages = getStoredPages()
		setPages(storedPages)
		store.widget.setState({ pagesCount: storedPages.length })
	}

	const handleUrlChange = () => {
		setCurrentPath(window.location.pathname)
	}

	registerWindowEventListener({
		event: 'ucho-storage-change',
		callback: handleStorageChange,
	})

	registerWindowEventListener({
		event: 'popstate',
		callback: handleUrlChange,
	})

	registerMutationObserver({
		target: document.documentElement,
		options: {
			childList: true,
			subtree: true,
		},
		callback: () => {
			setCurrentPath(window.location.pathname)
		},
	})

	registerWindowEventListener({
		event: 'keydown',
		callback: handleEscapeKey,
	})

	registerWindowEventListener({
		event: 'click',
		callback: handleOutsideClick,
	})

	const handleNavigate = (path: string, latestQuery?: string) => {
		if (!path.startsWith('/')) return
		const targetUrl = latestQuery ? `${path}${latestQuery}` : path
		window.location.href = targetUrl
		store.widget.setState({ isStoredFeedbackOpen: false })
	}

	const handleDelete = (path: string) => {
		if (currentPath() === path) {
			store.methods.reset()
		}
		clearPageState(path)

		const storedPages = getStoredPages()
		setPages(storedPages)
		store.widget.setState({ pagesCount: storedPages.length })
	}

	return (
		<Show when={store.widget.state.isStoredFeedbackOpen}>
			<div class="ucho-stored-feedback" ref={dialogRef}>
				<div class="ucho-stored-feedback-header">
					<h3>Unsubmitted Feedback</h3>
					<Button variant="secondary" size="sm" onClick={() => store.widget.setState({ isStoredFeedbackOpen: false })}>
						<XIcon size={20} />
					</Button>
				</div>
				<div class="ucho-stored-feedback-list">
					<For each={pages()}>
						{page => {
							const isCurrent = createMemo(() => page.path === currentPath())
							return (
								<div class={`ucho-stored-feedback-item ${isCurrent() ? 'ucho-stored-feedback-item-current' : ''}`}>
									<div class="ucho-stored-feedback-content">
										<div class="ucho-stored-feedback-path" title={page.path}>
											{page.displayPath}
										</div>
										<div class="ucho-stored-feedback-preview">{page.state.feedback.message}</div>
									</div>
									<div class="ucho-stored-feedback-actions">
										{!isCurrent() && (
											<Button
												class="ucho-stored-feedback-link"
												variant="secondary"
												size="sm"
												onClick={() => handleNavigate(page.path, page.state.latestQuery)}
											>
												<ExternalLinkIcon />
											</Button>
										)}
										<Button class="ucho-stored-feedback-delete" variant="secondary" size="sm" onClick={() => handleDelete(page.path)}>
											Delete
										</Button>
									</div>
								</div>
							)
						}}
					</For>
					<Show when={pages().length === 0}>
						<div class="ucho-stored-feedback-empty">No unsubmitted feedback</div>
					</Show>
				</div>
			</div>
		</Show>
	)
}
