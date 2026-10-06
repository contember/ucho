import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
	plugins: [solid(), tsconfigPaths()],
	build: {
		cssMinify: true,
		minify: true,
		lib: {
			entry: resolve(__dirname, 'src/index.tsx'),
			formats: ['es'],
			fileName: () => 'ucho.js',
		},
		rollupOptions: {
			// Bundle the browser-only Solid runtime so consumers do not install its SSR dependencies.
			external: ['@zumer/snapdom'],
		},
	},
})
