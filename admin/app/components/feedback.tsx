import { Component } from '@contember/interface'
import { initEcho } from 'contember-echo'
import { useEffect } from 'react'

export const FeedbackWidget = Component(() => {
	useEffect(() => {
		const cleanup = initEcho({
			onSubmit: async data => {
				// TODO: Send feedback data to your backend
				console.info('Feedback received:', data)

				// open screenshot in new tab
				if (data.screenshot) {
					const newWindow = window.open()
					if (newWindow) {
						newWindow.document.write(`<img src="${data.screenshot}" alt="Feedback Screenshot" />`)
						newWindow.document.close()
					}
				}
			},
		})

		return cleanup
	}, [])

	return null
})
