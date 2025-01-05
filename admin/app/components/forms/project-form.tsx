import { Component } from '@contember/interface'
import { FormLayout, InputField } from '~/lib/form'

export const ProjectForm = Component(() => (
	<FormLayout>
		<InputField field="name" label="Name" required />
		<InputField field="description" label="Description" />
	</FormLayout>
))
