import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'

export default defineConfig({
	plugins: [solid()],
	build: {
		lib: {
			entry: 'src/index.tsx',
			name: 'EchoWidget',
			formats: ['es', 'umd'],
			fileName: format => `echo-widget.${format}.js`,
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
