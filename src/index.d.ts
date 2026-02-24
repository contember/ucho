//@ts-nocheck
declare module '@contember/ucho' {
	export * from './types';
	export function init(options: import('./types').Config): () => void
}
