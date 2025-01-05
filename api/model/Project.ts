import { c } from '@contember/schema-definition'
import { projectManagerRole, stakeholderRole, viewerRole, developerRole } from './acl'
import { FeedbackItem } from './Feedback'
import { Grouping } from './Grouping'

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
export class Project {
	createdAt = c.dateTimeColumn().notNull().default('now')
	name = c.stringColumn().notNull()
	description = c.stringColumn()
	feedbackItems = c.oneHasMany(FeedbackItem, 'project')
	groupings = c.oneHasMany(Grouping, 'project')
}
