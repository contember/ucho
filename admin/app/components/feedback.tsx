import { Component } from '@contember/interface'
import { initEcho } from 'contember-echo'
import { useEffect } from 'react'

export const FeedbackWidget = Component(() => {
	useEffect(() => {
		const cleanup = initEcho({
			onSubmit: async data => {
				// TODO: Send feedback data to your backend
				await new Promise(resolve => setTimeout(resolve, 2000))
				console.info('Feedback received:', data)
			},
		})

		return cleanup
	}, [])

	return null
})
