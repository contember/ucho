import { Component } from '@contember/interface'
import { initEcho } from 'contember-echo'
import { useEffect } from 'react'

export const FeedbackWidget = Component(() => {
	useEffect(() => {
		const cleanup = initEcho({
			onSubmit: async data => {
				// TODO: Send feedback data to your backend
				console.info('Feedback received:', data)
				// throw new Error('Not implemented')
			},
		})

		return cleanup
	}, [])

	return null
})
