import { type EchoConfig, type FeedbackPayload, initEcho } from '@contember/echo'
import { useIdentity } from '@contember/interface'
import { useEffect, useMemo } from 'react'

const getCustomInputs = (userEmail: string | undefined): EchoConfig['customInputs'] => [
	{
		id: 'email',
		type: 'text',
		label: 'Email',
		required: false,
		placeholder: 'Your email address',
		defaultValue: userEmail,
		disabled: Boolean(userEmail),
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

// Handle feedback submission
const handleSubmit = async (projectSlug: string, data: FeedbackPayload) => {
	try {
		if (data.screenshot) {
			// Convert base64 to blob and create URL
			const response = await fetch(data.screenshot)
			const blob = await response.blob()
			const url = URL.createObjectURL(blob)
			window.open(url, '_blank')
			// Clean up the URL after opening
			URL.revokeObjectURL(url)
		}

		// Uncomment this to enable actual submission
		// const response = await fetch(`https://clientcare.contember.com/echo/project/${projectSlug}/task`, {
		// 	method: 'POST',
		// 	body: JSON.stringify(data),
		// 	headers: {
		// 		'Content-Type': 'application/json',
		// 	},
		// })
		//
		// return response

		// Simulate successful submission for now
		return new Response(null, { status: 200 })
	} catch (error) {
		console.error('Failed to submit feedback:', error)
		return new Response(null, { status: 500 })
	}
}

type EchoProps = {
	projectSlug: string
}

export const Echo = ({ projectSlug }: EchoProps) => {
	const identity = useIdentity()
	const userEmail = identity?.person?.email || undefined

	const customInputs = useMemo(() => getCustomInputs(userEmail), [userEmail])

	useEffect(() => {
		const dispose = initEcho({
			onSubmit: data => handleSubmit(projectSlug, data),
			customInputs,
			primaryColor: '#6227dc',
			position: 'bottom-right',
			textConfig: {
				welcomeMessage: {
					closeAriaLabel: 'Close',
					text: 'Click this button to share your thoughts or report issues.',
				},
			},
		})

		return dispose
	}, [customInputs, projectSlug])

	return null
}
