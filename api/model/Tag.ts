import { c } from '@contember/schema-definition'
import { FeedbackItem } from './Feedback'
import { developerRole, projectManagerRole, stakeholderRole, viewerRole } from './acl'

@c.Allow(projectManagerRole, {
	read: true,
	create: true,
	update: true,
	delete: true,
})
@c.Allow(stakeholderRole, {
	read: true,
})
@c.Allow(viewerRole, {
	read: true,
})
@c.Allow(developerRole, {
	read: true,
})
export class Tag {
	createdAt = c.dateTimeColumn().notNull().default('now')
	name = c.stringColumn().notNull()
	color = c.stringColumn()

	feedbackItems = c.manyHasManyInverse(FeedbackItem, 'tags')
}
