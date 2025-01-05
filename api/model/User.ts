import { c } from '@contember/schema-definition'
import { projectManagerRole, stakeholderRole, viewerRole, developerRole } from './acl'
import { FeedbackItem } from './Feedback'
import { Comment } from './Comment'
import { Person } from './Person'

@c.Allow(projectManagerRole, {
	read: ['name', 'email'],
})
@c.Allow(stakeholderRole, {
	read: ['name', 'email'],
})
@c.Allow(viewerRole, {
	read: ['name', 'email'],
})
@c.Allow(developerRole, {
	read: ['name', 'email'],
})
export class User {
	createdAt = c.dateTimeColumn().notNull().default('now')
	reportedFeedback = c.oneHasMany(FeedbackItem, 'reporter')
	name = c.stringColumn().notNull()
	email = c.stringColumn().notNull()
	comments = c.oneHasMany(Comment, 'user')
	person = c.oneHasOne(Person, 'userPerson')
}
