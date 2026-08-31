import type { TextConfig } from '~/types'

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
	chat: {
		title: 'Support',
		placeholder: 'Write a message…',
		sendButton: 'Send',
		openTitle: 'Open support chat',
		closeTitle: 'Close chat',
		emptyState: 'No messages yet. Ask us anything.',
		loading: 'Loading conversation…',
		errorMessage: 'Message could not be sent.',
		retryButton: 'Try again',
		feedbackLink: 'Send feedback instead',
		unreadLabel: 'unread messages',
		attachTitle: 'Attach a screenshot',
		attachBarText: 'Draw on the page to point something out, then attach it.',
		attachConfirm: 'Attach',
		attachCancel: 'Cancel',
		attachmentLabel: 'Screenshot attached',
		removeAttachment: 'Remove screenshot',
	},
}
