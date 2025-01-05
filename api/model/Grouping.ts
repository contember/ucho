import { c } from '@contember/schema-definition'
import { projectManagerRole, stakeholderRole, viewerRole, developerRole } from './acl'
import { FeedbackItem } from './Feedback'
import { Project } from './Project'

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
export class Grouping {
	createdAt = c.dateTimeColumn().notNull().default('now')
	feedbackItems = c.oneHasMany(FeedbackItem, 'group')
	name = c.stringColumn().notNull()
	description = c.stringColumn()
	project = c.manyHasOne(Project, 'groupings')
}
