//@ts-nocheck
declare module 'uchovat' {
	export * from './types';
	export function init(options: import('./types').Config): () => void
}
