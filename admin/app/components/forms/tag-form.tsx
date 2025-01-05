import { Component } from '@contember/interface'
import { FormLayout, InputField } from '~/lib/form'

export const TagForm = Component(() => (
	<FormLayout>
		<InputField field="name" label="Name" required />
		<InputField field="color" label="Color" />
	</FormLayout>
))
