import { Component, Field } from '@contember/interface'

export const FeedbackItemPreview = Component(() => (
	<div>
		<Field field="title" />
		<Field field="status" />
	</div>
))
