import { defineConfig } from 'vite'
import vitePluginDts from 'vite-plugin-dts'
import solid from 'vite-plugin-solid'

export default defineConfig({
	plugins: [solid(), vitePluginDts()],
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
