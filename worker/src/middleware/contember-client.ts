import { ContentClient } from '@contember/client-content'
import { GraphQlClient } from '@contember/graphql-client'
import { Context, MiddlewareHandler, Next } from 'hono'
import { env } from 'hono/adapter'
import { AppContext } from '../types'

export type ContemberClientMiddlewareOptions = {
	baseUrl: string
	projectSlug: string
	token: string
}

export const contemberClientMiddleWare = (options: ContemberClientMiddlewareOptions): MiddlewareHandler => {
	const { baseUrl, projectSlug, token } = options

	if (!baseUrl) throw new Error(`Missing baseUrl for Contember client. Got ${baseUrl}`)
	if (!projectSlug) throw new Error(`Missing project slug for Contember client. Got ${projectSlug}`)
	if (!token) throw new Error(`Missing token for Contember client. Got ${token}`)

	const clientUrl = new URL(baseUrl)
	clientUrl.pathname = `/content/${projectSlug}/live`

	return async (c, next) => {
		const graphQlClient = new GraphQlClient({ url: clientUrl.toString(), apiToken: token })
		const client = new ContentClient(graphQlClient)

		c.set('client', client)

		await next()
	}
}

export const contemberClient = async (c: Context<AppContext, '*', object>, next: Next) => {
	const { CONTEMBER_BASE_API_URL, CONTEMBER_PROJECT_SLUG, CONTEMBER_API_TOKEN } = env(c)

	const client = contemberClientMiddleWare({
		baseUrl: CONTEMBER_BASE_API_URL,
		projectSlug: CONTEMBER_PROJECT_SLUG,
		token: CONTEMBER_API_TOKEN,
	})

	return client(c, next)
}
