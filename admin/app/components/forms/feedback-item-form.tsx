import { Component } from '@contember/interface'
import { GroupingPreview } from '~/app/components/previews/grouping-preview'
import { ProjectPreview } from '~/app/components/previews/project-preview'
import { TagPreview } from '~/app/components/previews/tag-preview'
import { UserPreview } from '~/app/components/previews/user-preview'
import { FormLayout, InputField, MultiSelectField, SelectEnumField, SelectField } from '~/lib/form'

export const FeedbackItemForm = Component(() => <FormLayout>
	<InputField field="title" label="Title" required />
	<InputField field="description" label="Description" required />
	<InputField field="attachments" label="Attachments" />
	<SelectEnumField
		field="status"
		label="Status"
		options={{ open: 'open', inProgress: 'inProgress', resolved: 'resolved' }}
	/>
	<SelectEnumField field="priority" label="Priority" options={{ low: 'low', medium: 'medium', high: 'high' }} />
	<InputField field="date" label="Date" required />
	<SelectField field="project" label="Project">
		<ProjectPreview />
	</SelectField>
	<SelectField field="group" label="Group">
		<GroupingPreview />
	</SelectField>
	<SelectField field="reporter" label="Reporter">
		<UserPreview />
	</SelectField>
	<MultiSelectField field="tags" label="Tags">
		<TagPreview />
	</MultiSelectField>
</FormLayout>)
