import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
	plugins: [solid(), tsconfigPaths()],
	build: {
		lib: {
			entry: 'src/index.tsx',
			name: 'Echo',
			formats: ['es', 'umd'],
			fileName: format => `echo.${format}.js`,
		},
		rollupOptions: {
			external: ['solid-js'],
			output: {
				globals: {
					'solid-js': 'Solid',
				},
			},
		},
	},
})
