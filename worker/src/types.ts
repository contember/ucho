import { ContentClient } from '@contember/client-content'

export type Env = {
	CONTEMBER_BASE_API_URL: string
	CONTEMBER_PROJECT_SLUG: string
	CONTEMBER_API_TOKEN: string
	CONTEMBER_ACTIONS_SECRET_KEY: string
}

export type AppContext = {
	Bindings: Env
	Variables: { client: ContentClient }
}
