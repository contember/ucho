import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import { feedbackSaver } from '../vite-plugin-feedback-saver'

export default defineConfig({
	plugins: [
		react(),
		feedbackSaver({ outputDir: resolve(__dirname, 'feedback-output') }),
	],
	resolve: {
		alias: {
			'ucho-js': resolve(__dirname, '../../dist/ucho.js'),
		},
	},
})
