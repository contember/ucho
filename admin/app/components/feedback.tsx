import { type FeedbackData, initEcho } from '@app/echo'
import { Component } from '@contember/interface'
import { useEffect } from 'react'

export const FeedbackWidget = Component(() => {
	useEffect(() => {
		const cleanup = initEcho({
			onSubmit: async (data: FeedbackData) => {
				// TODO: Send feedback data to your backend
				console.info('Feedback received:', data)
			},
		})

		return cleanup
	}, [])

	return null
})
