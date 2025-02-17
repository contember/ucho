import { type EchoConfig, type FeedbackPayload, initEcho } from '@contember/echo'
import { Component } from '@contember/interface'
import { useEffect } from 'react'

const customInputs: EchoConfig['customInputs'] = [
	{
		id: 'name',
		type: 'text',
		label: 'Name',
		required: false,
		placeholder: 'Enter your name',
		defaultValue: '',
	},
	{
		id: 'category',
		type: 'select',
		label: 'Feedback Category',
		required: false,
		options: [
			{ value: 'bug', label: 'Bug Report' },
			{ value: 'feature', label: 'Feature Request' },
			{ value: 'improvement', label: 'Improvement Suggestion' },
			{ value: 'other', label: 'Other' },
		],
		placeholder: 'Select a category',
		defaultValue: 'bug',
	},
	{
		id: 'priority',
		type: 'radio',
		label: 'Priority Level',
		required: true,
		options: [
			{ value: 'low', label: 'Low' },
			{ value: 'medium', label: 'Medium' },
			{ value: 'high', label: 'High' },
		],
		defaultValue: 'medium',
	},
	{
		id: 'impact',
		type: 'checkbox',
		label: 'Impact Areas',
		required: true,
		options: [
			{ value: 'functionality', label: 'Functionality' },
			{ value: 'performance', label: 'Performance' },
			{ value: 'ui', label: 'User Interface' },
			{ value: 'security', label: 'Security' },
		],
		defaultValue: ['functionality'],
	},
	{
		id: 'steps',
		type: 'textarea',
		label: 'Steps to Reproduce (if applicable)',
		placeholder: 'Please provide detailed steps to reproduce the issue...',
		defaultValue: '1. \n2. \n3. ',
	},
]

export const Echo = Component(() => {
	useEffect(() => {
		const dispose = initEcho({
			onSubmit: async (data: FeedbackPayload) => {
				if (data.screenshot) {
					// Convert base64 to blob and create URL
					const response = await fetch(data.screenshot)
					const blob = await response.blob()
					const url = URL.createObjectURL(blob)
					window.open(url, '_blank')
					// Clean up the URL after opening
					URL.revokeObjectURL(url)
				}

				// const response = await fetch('https://clientcare.contember.com/echo/project/echo/task', {
				// 	method: 'POST',
				// 	body: JSON.stringify(data),
				// })
				// return response
			},
			customInputs,
		})

		return dispose
	}, [])

	return null
})
