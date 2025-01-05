import { c } from '@contember/schema-definition'
import { User } from './User'

@c.Unique('personId')
export class Person {
	createdAt = c.dateTimeColumn().notNull().default('now')
	personId = c.uuidColumn().notNull()
	updatedAt = c.dateTimeColumn().notNull().default('now')
	tenantPerson = c.oneHasOneInverse(TenantPerson, 'person')
	userPerson = c.oneHasOneInverse(User, 'person')
}

@c.View(`
	SELECT
		tenant_person.id,
		tenant_person.email,
		tenant_person.name,
		tenant_person.identity_id,
		content_person.id AS person_id,
		STRING_AGG(DISTINCT project_membership.role, ', ') AS roles
	FROM person AS content_person
		FULL OUTER JOIN tenant.person AS tenant_person ON tenant_person.id = content_person.person_id
		LEFT JOIN tenant.identity AS tenant_identity ON tenant_person.identity_id = tenant_identity.id
		LEFT JOIN tenant.project_membership AS project_membership ON tenant_identity.id = project_membership.identity_id
	WHERE tenant_person.id IS NOT NULL
	GROUP BY tenant_person.id, content_person.id
`)
export class TenantPerson {
	createdAt = c.dateTimeColumn().notNull().default('now')
	identityId = c.uuidColumn().notNull()
	email = c.stringColumn()
	name = c.stringColumn()
	otpUri = c.stringColumn()
	otpActivatedAt = c.stringColumn()
	idpOnly = c.stringColumn()
	roles = c.stringColumn()
	person = c.oneHasOne(Person, 'tenantPerson')
}
