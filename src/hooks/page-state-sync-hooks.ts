import { registerMutationObserver, registerWindowEventListener } from '~/utils/listeners'
import { getPageKey } from '~/utils/storage'

export type PageStateSyncProps = {
	onUrlChange: (newPageKey: string) => void
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

	registerWindowEventListener({ event: 'popstate', callback: handleUrlChange })
	registerWindowEventListener({ event: 'pushstate', callback: handleUrlChange })
	registerWindowEventListener({ event: 'replacestate', callback: handleUrlChange })

	registerMutationObserver({
		target: document.documentElement,
		options: {
			childList: true,
			subtree: true,
		},
		callback: handleUrlChange,
	})
}
