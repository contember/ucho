import { Component, For, Show, createSignal, onCleanup, onMount } from 'solid-js'
import { ExternalLinkIcon } from '~/components/icons/ExternalLinkIcon'
import { useEchoStore } from '~/contexts'
import { clearPageState, getStoredPages } from '~/utils/storage'

export const SavedPagesDropdown: Component = () => {
	const store = useEchoStore()
	const [pages, setPages] = createSignal(getStoredPages())
	const currentPath = () => window.location.pathname

	onMount(() => {
		const handleStorageChange = () => {
			const storedPages = getStoredPages()
			setPages(storedPages)
			store.setWidget({ pagesCount: storedPages.length })
		}

		window.addEventListener('echo-storage-change', handleStorageChange)
		onCleanup(() => {
			window.removeEventListener('echo-storage-change', handleStorageChange)
		})
	})

	const handleNavigate = (path: string) => {
		window.location.href = path
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
				</div>
				<div class="echo-saved-pages-list">
					<For each={pages()}>
						{page => {
							const isCurrent = page.path === currentPath()
							return (
								<div class={`echo-saved-pages-item ${isCurrent ? 'echo-saved-pages-item-current' : ''}`}>
									<div class="echo-saved-pages-content">
										<div class="echo-saved-pages-path">
											<span title={page.path}>{formatPath(page.path)}</span>
										</div>
										<div class="echo-saved-pages-preview">{page.state.feedback.comment}</div>
									</div>
									<div class="echo-saved-pages-actions">
										{!isCurrent && (
											<button
												class="echo-saved-pages-link"
												onClick={() => handleNavigate(page.path)}
												title={`Go to ${page.path}`}
												aria-label={`Go to ${page.path}`}
											>
												<ExternalLinkIcon />
											</button>
										)}
										<button
											class="echo-saved-pages-delete"
											onClick={() => handleDelete(page.path)}
											style={{ color: store.widget.primaryColor }}
											title={`Delete feedback for ${page.path}`}
											aria-label={`Delete feedback for ${page.path}`}
										>
											Delete
										</button>
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
