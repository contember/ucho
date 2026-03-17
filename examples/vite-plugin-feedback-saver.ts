import { mkdirSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import type { Plugin } from 'vite'

export type FeedbackSaverOptions = {
	outputDir: string
	endpoint?: string
}

export function feedbackSaver({ outputDir, endpoint = '/api/feedback' }: FeedbackSaverOptions): Plugin {
	return {
		name: 'feedback-saver',
		configureServer(server) {
			server.middlewares.use(endpoint, (req, res) => {
				if (req.method !== 'POST') {
					res.statusCode = 405
					res.end()
					return
				}
				let body = ''
				req.on('data', (chunk: Buffer) => { body += chunk.toString() })
				req.on('end', () => {
					try {
						const data = JSON.parse(body)
						mkdirSync(outputDir, { recursive: true })

						const timestamp = new Date().toISOString().replace(/[:.]/g, '-')

						if (data.screenshot) {
							const base64 = data.screenshot.replace(/^data:image\/jpeg;base64,/, '')
							writeFileSync(resolve(outputDir, `${timestamp}-screenshot.jpg`), Buffer.from(base64, 'base64'))
							data.screenshot = `${timestamp}-screenshot.jpg`
						}

						writeFileSync(resolve(outputDir, `${timestamp}-feedback.json`), JSON.stringify(data, null, 2))

						res.setHeader('Content-Type', 'application/json')
						res.statusCode = 200
						res.end(JSON.stringify({ ok: true }))
					} catch {
						res.statusCode = 400
						res.end(JSON.stringify({ error: 'Invalid JSON' }))
					}
				})
			})
		},
	}
}
