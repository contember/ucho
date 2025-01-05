import { c } from '@contember/schema-definition'
import { projectManagerRole, stakeholderRole, viewerRole, developerRole } from './acl'
import { FeedbackItem } from './Feedback'

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
