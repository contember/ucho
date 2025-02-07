import { initEcho } from '@contember/echo'
import { Component } from '@contember/interface'
import { useEffect } from 'react'

export const FeedbackWidget = Component(() => {
	useEffect(() => {
		const cleanup = initEcho({
			onSubmit: async data => {
				return fetch('https://clientcare.contember.com/echo/project/echo/task', {
					method: 'POST',
					body: JSON.stringify(data),
				})
			},
		})

		return cleanup
	}, [])

	return null
})
