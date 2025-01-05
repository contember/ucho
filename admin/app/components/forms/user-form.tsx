import { Component } from '@contember/interface'
import { FormLayout, InputField } from '~/lib/form'

export const UserForm = Component(() => (
	<FormLayout>
		<InputField field="name" label="Name" required />
		<InputField field="email" label="Email" required />
	</FormLayout>
))
