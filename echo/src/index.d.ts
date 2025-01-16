declare module '@app/echo' {
	export * from './types'
	export function initEcho(options: import('./types').EchoOptions): () => void
}
