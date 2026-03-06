import { onCleanup, onMount } from 'solid-js'
import { registerWindowEventListener } from '~/utils/listeners'
import { getPageKey } from '~/utils/storage'

export type PageStateSyncProps = {
	onUrlChange: (newPageKey: string) => void
}

const patchHistoryMethod = (method: 'pushState' | 'replaceState') => {
	const original = history[method]
	history[method] = function(...args: Parameters<typeof original>) {
		const result = original.apply(this, args)
		window.dispatchEvent(new Event(method.toLowerCase()))
		return result
	}
	return () => {
		history[method] = original
	}
}

export const usePageStateSync = ({ onUrlChange }: PageStateSyncProps) => {
	let currentPageKey = getPageKey()

	const handleUrlChange = () => {
		const newPageKey = getPageKey()
		if (newPageKey !== currentPageKey) {
			currentPageKey = newPageKey
			onUrlChange(newPageKey)
		}
	}

	let restorePushState: (() => void) | undefined
	let restoreReplaceState: (() => void) | undefined

	onMount(() => {
		restorePushState = patchHistoryMethod('pushState')
		restoreReplaceState = patchHistoryMethod('replaceState')
	})

	onCleanup(() => {
		restorePushState?.()
		restoreReplaceState?.()
	})

	registerWindowEventListener({ event: 'popstate', callback: handleUrlChange })
	registerWindowEventListener({ event: 'pushstate', callback: handleUrlChange })
	registerWindowEventListener({ event: 'replacestate', callback: handleUrlChange })

	// URL changes are already detected via pushstate/replacestate/popstate events.
	// No MutationObserver needed here.
}
