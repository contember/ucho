import { c } from '@contember/schema-definition'

export const feedbackStatus = c.createEnum('open', 'inProgress', 'resolved')
export const priority = c.createEnum('low', 'medium', 'high')
