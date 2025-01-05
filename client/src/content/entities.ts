import type { FeedbackStatus } from './enums'
import type { Priority } from './enums'

export type JSONPrimitive = string | number | boolean | null
export type JSONValue = JSONPrimitive | JSONObject | JSONArray
export type JSONObject = { readonly [K in string]?: JSONValue }
export type JSONArray = readonly JSONValue[]

export type Comment <OverRelation extends string | never = never> = {
	name: 'Comment'
	unique:
		| Omit<{ id: string}, OverRelation>
	columns: {
		id: string
		createdAt: string
		content: string
		date: string
	}
	hasOne: {
		feedbackItem: FeedbackItem
		user: User
	}
	hasMany: {
	}
	hasManyBy: {
	}
}
export type FeedbackItem <OverRelation extends string | never = never> = {
	name: 'FeedbackItem'
	unique:
		| Omit<{ id: string}, OverRelation>
		| Omit<{ comments: Comment['unique']}, OverRelation>
	columns: {
		id: string
		createdAt: string
		title: string
		description: string
		attachments: string | null
		status: FeedbackStatus
		priority: Priority
		date: string
	}
	hasOne: {
		project: Project
		group: Grouping
		reporter: User
	}
	hasMany: {
		comments: Comment<'feedbackItem'>
		tags: Tag
	}
	hasManyBy: {
	}
}
export type Grouping <OverRelation extends string | never = never> = {
	name: 'Grouping'
	unique:
		| Omit<{ id: string}, OverRelation>
		| Omit<{ feedbackItems: FeedbackItem['unique']}, OverRelation>
	columns: {
		id: string
		createdAt: string
		name: string
		description: string | null
	}
	hasOne: {
		project: Project
	}
	hasMany: {
		feedbackItems: FeedbackItem<'group'>
	}
	hasManyBy: {
		feedbackItemsByComments: { entity: FeedbackItem; by: {comments: Comment['unique']}  }
	}
}
export type Person <OverRelation extends string | never = never> = {
	name: 'Person'
	unique:
		| Omit<{ id: string}, OverRelation>
		| Omit<{ personId: string}, OverRelation>
		| Omit<{ tenantPerson: TenantPerson['unique']}, OverRelation>
		| Omit<{ userPerson: User['unique']}, OverRelation>
	columns: {
		id: string
		createdAt: string
		personId: string
		updatedAt: string
	}
	hasOne: {
		tenantPerson: TenantPerson
		userPerson: User
	}
	hasMany: {
	}
	hasManyBy: {
	}
}
export type Project <OverRelation extends string | never = never> = {
	name: 'Project'
	unique:
		| Omit<{ id: string}, OverRelation>
		| Omit<{ feedbackItems: FeedbackItem['unique']}, OverRelation>
		| Omit<{ groupings: Grouping['unique']}, OverRelation>
	columns: {
		id: string
		createdAt: string
		name: string
		description: string | null
	}
	hasOne: {
	}
	hasMany: {
		feedbackItems: FeedbackItem<'project'>
		groupings: Grouping<'project'>
	}
	hasManyBy: {
		feedbackItemsByComments: { entity: FeedbackItem; by: {comments: Comment['unique']}  }
		groupingsByFeedbackItems: { entity: Grouping; by: {feedbackItems: FeedbackItem['unique']}  }
	}
}
export type Tag <OverRelation extends string | never = never> = {
	name: 'Tag'
	unique:
		| Omit<{ id: string}, OverRelation>
	columns: {
		id: string
		createdAt: string
		name: string
		color: string | null
	}
	hasOne: {
	}
	hasMany: {
		feedbackItems: FeedbackItem
	}
	hasManyBy: {
	}
}
export type TenantPerson <OverRelation extends string | never = never> = {
	name: 'TenantPerson'
	unique:
		| Omit<{ id: string}, OverRelation>
		| Omit<{ person: Person['unique']}, OverRelation>
	columns: {
		id: string
		createdAt: string
		identityId: string
		email: string | null
		name: string | null
		otpUri: string | null
		otpActivatedAt: string | null
		idpOnly: string | null
		roles: string | null
	}
	hasOne: {
		person: Person
	}
	hasMany: {
	}
	hasManyBy: {
	}
}
export type User <OverRelation extends string | never = never> = {
	name: 'User'
	unique:
		| Omit<{ id: string}, OverRelation>
		| Omit<{ reportedFeedback: FeedbackItem['unique']}, OverRelation>
		| Omit<{ comments: Comment['unique']}, OverRelation>
		| Omit<{ person: Person['unique']}, OverRelation>
	columns: {
		id: string
		createdAt: string
		name: string
		email: string
	}
	hasOne: {
		person: Person
	}
	hasMany: {
		reportedFeedback: FeedbackItem<'reporter'>
		comments: Comment<'user'>
	}
	hasManyBy: {
		reportedFeedbackByComments: { entity: FeedbackItem; by: {comments: Comment['unique']}  }
	}
}

export type ContemberClientEntities = {
	Comment: Comment
	FeedbackItem: FeedbackItem
	Grouping: Grouping
	Person: Person
	Project: Project
	Tag: Tag
	TenantPerson: TenantPerson
	User: User
}

export type ContemberClientSchema = {
	entities: ContemberClientEntities
}
