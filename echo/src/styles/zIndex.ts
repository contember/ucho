const zIndex = {
	root: 999999,
	/* overlay */
	overlay: 1,
	/* launcher */
	launcher: 2,
	widgetButton: 2,
	notification: 2,
	welcomeMessage: 2,
	/* feedback */
	feedbackForm: 4,
	/* drawing */
	drawingToolbar: 3,
	shapeActions: 3,
	drawingTooltip: 3,
} as const

export { zIndex }
