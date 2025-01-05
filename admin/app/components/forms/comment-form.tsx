import { Component } from '@contember/interface'
import { FeedbackItemPreview } from '~/app/components/previews/feedback-item-preview'
import { UserPreview } from '~/app/components/previews/user-preview'
import { FormLayout, InputField, SelectField } from '~/lib/form'

export const CommentForm = Component(() => <FormLayout>
	<InputField field="content" label="Content" required />
	<InputField field="date" label="Date" required />
	<SelectField field="feedbackItem" label="Feedback item">
		<FeedbackItemPreview />
	</SelectField>
	<SelectField field="user" label="User">
		<UserPreview />
	</SelectField>
</FormLayout>)
