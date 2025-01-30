import { type Component, For, Show, createMemo, createSignal, onCleanup, onMount } from 'solid-js'
import { Button } from '~/components/atoms/Button'
import { XIcon } from '~/components/icons'
import { ExternalLinkIcon } from '~/components/icons/ExternalLinkIcon'
import { useEchoStore } from '~/contexts'
import { clearPageState, getStoredPages } from '~/utils/storage'

export const SavedPagesDropdown: Component = () => {
	const store = useEchoStore()
	const [pages, setPages] = createSignal(getStoredPages())
	const [currentPath, setCurrentPath] = createSignal(window.location.pathname)

	onMount(() => {
		const handleStorageChange = () => {
			const storedPages = getStoredPages()
			setPages(storedPages)
			store.setWidget({ pagesCount: storedPages.length })
		}

		const handleUrlChange = () => {
			setCurrentPath(window.location.pathname)
		}

		window.addEventListener('echo-storage-change', handleStorageChange)
		window.addEventListener('popstate', handleUrlChange)

		const observer = new MutationObserver(() => {
			setCurrentPath(window.location.pathname)
		})

		observer.observe(document.documentElement, {
			subtree: true,
			childList: true,
		})

		onCleanup(() => {
			window.removeEventListener('echo-storage-change', handleStorageChange)
			window.removeEventListener('popstate', handleUrlChange)
			observer.disconnect()
		})
	})

	const handleNavigate = (path: string, latestQuery?: string) => {
		const targetUrl = latestQuery ? `${path}${latestQuery}` : path
		window.location.href = targetUrl
		store.setWidget({ isPagesDropdownOpen: false })
	}

	const handleDelete = (path: string) => {
		if (currentPath() === path) {
			store.methods.reset()
		}
		clearPageState(path)

		const storedPages = getStoredPages()
		setPages(storedPages)
		store.setWidget({ pagesCount: storedPages.length })
	}

	const formatPath = (path: string) => {
		if (path === '/') return '/'
		const parts = path.split('/')
		if (parts.length <= 4) return path

		return `/${parts[1]}/.../${parts[parts.length - 1]}`
	}

	return (
		<Show when={store.widget.isPagesDropdownOpen}>
			<div class="echo-saved-pages-dropdown">
				<div class="echo-saved-pages-header">
					<h3>Saved Feedback</h3>
					<Button variant="secondary" size="sm" onClick={() => store.setWidget({ isPagesDropdownOpen: false })} title="Close">
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
										<div class="echo-saved-pages-path">
											<span title={page.path}>{formatPath(page.path)}</span>
										</div>
										<div class="echo-saved-pages-preview">{page.state.feedback.comment}</div>
									</div>
									<div class="echo-saved-pages-actions">
										{!isCurrent() && (
											<Button
												variant="secondary"
												size="sm"
												class="echo-saved-pages-link"
												onClick={() => handleNavigate(page.path, page.state.latestQuery)}
												title="Open page"
											>
												<ExternalLinkIcon />
											</Button>
										)}
										<Button variant="secondary" size="md" class="echo-saved-pages-delete" onClick={() => handleDelete(page.path)}>
											Delete
										</Button>
									</div>
								</div>
							)
						}}
					</For>
				</div>
				<Show when={pages().length === 0}>
					<div class="echo-saved-pages-empty">No saved feedback yet</div>
				</Show>
			</div>
		</Show>
	)
}
