//@ts-nocheck
declare module '@contember/echo' {
	export * from './types'
	export function initEcho(options: import('./types').EchoConfig): () => void
}
