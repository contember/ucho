import { createSchema, PermissionsBuilder, settingsPresets } from '@contember/schema-definition'
import * as model from './model'

export default createSchema(model, schema => ({
	...schema,
	acl: {
		...schema.acl,
		roles: {
			...schema.acl.roles,
			admin: {
				...schema.acl.roles.admin,
				entities: PermissionsBuilder.create(schema.model).allowAll().allowCustomPrimary().permissions,
				variables: { ...schema.acl.roles.admin?.variables },
			},
		},
	},
	settings: settingsPresets['v1.4'],
}))
