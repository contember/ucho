import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { contemberClient } from './middleware/contember-client'
import { AppContext } from './types'

const app = new Hono<AppContext>()

/**
 * Enable Contember client, cors and authorization for all routes starting with `/contember/`.
 */
app.use(
	'/contember/*',
	cors(),
	contemberClient,
	// Uncomment to enable bearer authorization for all routes starting with `/contember/`. Your Contember API has to have a `Settings` entity with a `workerAPiKey` field.
	// async (c, next) => {
	// const { CONTEMBER_ACTIONS_SECRET_KEY } = env(c)
	// 	const { client } = c.var
	//
	// 	const settings = await client.query(queryBuilder.get('Settings', { by: { unique: 'unique' } }, it => it.$('workerAPiKey')))
	//
	// 	const auth = bearerAuth({ token: settings?.workerAPiKey ? [settings.workerAPiKey, CONTEMBER_ACTIONS_SECRET_KEY] : [CONTEMBER_ACTIONS_SECRET_KEY] })
	//
	// 	return auth(c, next)
	// },
)

app.get('/', c => {
	return c.text('Welcome to your worker.')
})

/**
 * Cron jobs
 *
 * Uncomment to enable cron jobs with Hono. Don't forget to remove last linet `export default app`.
 */

// export default {
// 	fetch: app.fetch,
// 	async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
// 		switch (event.cron) {
// 			case '0 5 * * *': /* every day at 5:00 */
// 				ctx.waitUntil()
// 				break
// 			case '0 4 1 * *': /* every 1st day in month at 4:00 */
// 				ctx.waitUntil()
// 				break
// 			case '5 4 1 * *': /* every 1st day in month at 4:05 */
// 				ctx.waitUntil()
// 				break
// 		}
// 	},
// }

export default app
