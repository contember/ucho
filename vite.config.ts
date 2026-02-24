import { resolve } from 'path'
import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
	plugins: [solid(), tsconfigPaths()],
	build: {
		lib: {
			entry: resolve(__dirname, 'src/index.tsx'),
			name: 'Ucho',
			formats: ['es', 'umd'],
			fileName: format => `ucho.${format}.js`,
		},
		rollupOptions: {
			external: ['solid-js', 'html2canvas-pro'],
			output: {
				globals: {
					'solid-js': 'Solid',
					'html2canvas-pro': 'html2canvas-pro',
				},
			},
		},
	},
})
