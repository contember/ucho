import { Component } from '@contember/interface'
import { ProjectPreview } from '~/app/components/previews/project-preview'
import { FormLayout, InputField, SelectField } from '~/lib/form'

export const GroupingForm = Component(() => <FormLayout>
	<InputField field="name" label="Name" required />
	<InputField field="description" label="Description" />
	<SelectField field="project" label="Project">
		<ProjectPreview />
	</SelectField>
</FormLayout>)
