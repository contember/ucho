import { c } from '@contember/schema-definition'
import { projectManagerRole, stakeholderRole, viewerRole, developerRole } from './acl'
import { FeedbackItem } from './Feedback'
import { User } from './User'

@c.Allow(projectManagerRole, {
	read: true,
	create: true,
	update: true,
})
@c.Allow(stakeholderRole, {
	read: true,
})
@c.Allow(viewerRole, {
	read: true,
})
@c.Allow(developerRole, {
	read: true,
	create: true,
	update: true,
})
export class Comment {
	createdAt = c.dateTimeColumn().notNull().default('now')
	content = c.stringColumn().notNull()
	date = c.dateTimeColumn().notNull()
	feedbackItem = c.manyHasOne(FeedbackItem, 'comments')
	user = c.manyHasOne(User, 'comments')
}
