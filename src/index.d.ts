//@ts-nocheck
declare module 'ucho' {
	export * from './types';
	export function init(options: import('./types').Config): () => void
}
