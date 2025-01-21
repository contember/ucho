import { Component } from 'solid-js'
import { DrawingLayer } from './DrawingLayer'
import { DrawingToolbar } from './DrawingToolbar'

export const Overlay: Component = () => {
	return (
		<div class="echo-overlay">
			<DrawingToolbar />
			<DrawingLayer />
		</div>
	)
}
