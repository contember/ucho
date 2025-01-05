import { c } from '@contember/schema-definition'

export const projectManagerRole = c.createRole('projectManager', { stages: '*' })
export const stakeholderRole = c.createRole('stakeholder', { stages: '*' })
export const viewerRole = c.createRole('viewer', { stages: '*' })
export const developerRole = c.createRole('developer', { stages: '*' })
