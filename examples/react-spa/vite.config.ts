import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			'ucho-js': resolve(__dirname, '../../dist/ucho.js'),
		},
	},
})
