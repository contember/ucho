import type { TextConfig } from '~/types'

/**
 * The launcher's opening line has to promise what is actually behind it: with chat
 * configured the widget is no longer only "leave feedback", and with both routes it is
 * neither one on its own. Still just a default — `textConfig.welcomeMessage` wins.
 */
export const getDefaultWelcomeText = (has: { feedback: boolean; chat: boolean }): string => {
	if (has.chat && has.feedback) return 'Need help, or got feedback?'
	if (has.chat) return 'Need help? Chat with us'
	return 'Click here to leave feedback'
}

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
	menu: {
		title: 'How can we help?',
		openTitle: 'Open support and feedback',
		closeTitle: 'Close menu',
		backTitle: 'Back to menu',
		chatTitle: 'Chat with us',
		chatDescription: 'Ask a question and get an answer right here.',
		feedbackTitle: 'Send feedback',
		feedbackDescription: 'Report a problem or suggest an improvement.',
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
