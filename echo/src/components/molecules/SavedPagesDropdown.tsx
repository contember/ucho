import { type Component, For, Show, createMemo, createSignal } from 'solid-js'
import { Button } from '~/components/atoms/Button'
import { XIcon } from '~/components/icons'
import { ExternalLinkIcon } from '~/components/icons/ExternalLinkIcon'
import { useEchoStore } from '~/contexts'
import { registerMutationObserver, registerWindowEventListener } from '~/utils/listener'
import { clearPageState, getStoredPages } from '~/utils/storage'

export const SavedPagesDropdown: Component = () => {
	const store = useEchoStore()
	const [pages, setPages] = createSignal(getStoredPages())
	const [currentPath, setCurrentPath] = createSignal(window.location.pathname)

	const handleStorageChange = () => {
		const storedPages = getStoredPages()
		setPages(storedPages)
		store.widget.setState({ pagesCount: storedPages.length })
	}

	const handleUrlChange = () => {
		setCurrentPath(window.location.pathname)
	}

	registerWindowEventListener({
		event: 'echo-storage-change',
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

	const handleNavigate = (path: string, latestQuery?: string) => {
		const targetUrl = latestQuery ? `${path}${latestQuery}` : path
		window.location.href = targetUrl
		store.widget.setState({ isPagesDropdownOpen: false })
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

	const formatPath = (path: string) => {
		if (path === '/') return '/'
		const parts = path.split('/')
		if (parts.length <= 4) return path
		return `/${parts[1]}/.../${parts[parts.length - 1]}`
	}

	return (
		<Show when={store.widget.state.isPagesDropdownOpen}>
			<div class="echo-saved-pages-dropdown">
				<div class="echo-saved-pages-header">
					<h3>Saved Feedback</h3>
					<Button variant="secondary" size="sm" onClick={() => store.widget.setState({ isPagesDropdownOpen: false })}>
						<XIcon size={20} />
					</Button>
				</div>
				<div class="echo-saved-pages-list">
					<For each={pages()}>
						{page => {
							const isCurrent = createMemo(() => page.path === currentPath())
							return (
								<div class={`echo-saved-pages-item ${isCurrent() ? 'echo-saved-pages-item-current' : ''}`}>
									<div class="echo-saved-pages-content">
										<div class="echo-saved-pages-path" title={page.path}>
											{formatPath(page.path)}
										</div>
										<div class="echo-saved-pages-preview">{page.state.feedback.comment}</div>
									</div>
									<div class="echo-saved-pages-actions">
										{!isCurrent() && (
											<Button
												class="echo-saved-pages-link"
												variant="secondary"
												size="sm"
												onClick={() => handleNavigate(page.path, page.state.latestQuery)}
											>
												<ExternalLinkIcon />
											</Button>
										)}
										<Button class="echo-saved-pages-delete" variant="secondary" size="sm" onClick={() => handleDelete(page.path)}>
											Delete
										</Button>
									</div>
								</div>
							)
						}}
					</For>
					<Show when={pages().length === 0}>
						<div class="echo-saved-pages-empty">No saved feedback yet</div>
					</Show>
				</div>
			</div>
		</Show>
	)
}
