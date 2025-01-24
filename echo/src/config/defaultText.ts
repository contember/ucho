import { TextConfig } from '~/types'

export const defaultText: TextConfig = {
	welcomeMessage: {
		text: 'Click here to leave feedback',
		closeAriaLabel: 'Close welcome message',
	},
	feedbackForm: {
		title: 'Send Feedback',
		placeholder: "What's on your mind? We'd love to hear your feedback...",
		screenshotAlt: 'Screenshot Preview',
		submitButton: 'Send Feedback',
		minimizeTitle: 'Minimize',
		expandTitle: 'Expand',
		closeTitle: 'Close',
		showFormTitle: 'Show Feedback Form',
	},
	notification: {
		successTitle: 'Thank you for your feedback!',
		errorTitle: 'Something went wrong.',
		errorMessage: 'Failed to send feedback. Please try again.',
		hideTitle: 'Hide notification',
	},
	drawingTooltip: {
		text: 'Click & drag to draw',
	},
}
