import { c } from '@contember/schema-definition'
import { projectManagerRole, stakeholderRole, viewerRole, developerRole } from './acl'
import { feedbackStatus, priority } from './enum'
import { Project } from './Project'
import { Grouping } from './Grouping'
import { User } from './User'
import { Comment } from './Comment'
import { Tag } from './Tag'

@c.Allow(projectManagerRole, {
	read: ['createdAt', 'title', 'description', 'attachments', 'status', 'priority', 'date', 'project', 'group', 'reporter', 'comments'],
	create: ['createdAt', 'title', 'description', 'attachments', 'status', 'priority', 'date', 'project', 'group', 'reporter', 'comments'],
	update: ['createdAt', 'title', 'description', 'attachments', 'status', 'priority', 'date', 'project', 'group', 'reporter', 'comments'],
	delete: true,
})
@c.Allow(stakeholderRole, {
	read: ['createdAt', 'title', 'description', 'attachments', 'status', 'priority', 'date', 'project', 'group', 'reporter', 'comments'],
})
@c.Allow(viewerRole, {
	read: ['createdAt', 'title', 'description', 'attachments', 'status', 'priority', 'date', 'project', 'group', 'reporter', 'comments'],
})
@c.Allow(developerRole, {
	read: ['createdAt', 'title', 'description', 'attachments', 'status', 'priority', 'date', 'project', 'group', 'reporter', 'comments'],
	update: ['createdAt', 'title', 'description', 'attachments', 'status', 'priority', 'date', 'project', 'group', 'reporter', 'comments'],
})
export class FeedbackItem {
	createdAt = c.dateTimeColumn().notNull().default('now')
	title = c.stringColumn().notNull()
	description = c.stringColumn().notNull()
	attachments = c.stringColumn()
	status = c.enumColumn(feedbackStatus).notNull()
	priority = c.enumColumn(priority).notNull()
	date = c.dateTimeColumn().notNull()
	project = c.manyHasOne(Project, 'feedbackItems')
	group = c.manyHasOne(Grouping, 'feedbackItems')
	reporter = c.manyHasOne(User, 'reportedFeedback')
	comments = c.oneHasMany(Comment, 'feedbackItem')
	tags = c.manyHasMany(Tag, 'feedbackItems')
}
