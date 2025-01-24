import { Component } from 'solid-js'
import { DrawingLayer } from '~/features/drawing/components/DrawingLayer'
import { DrawingToolbar } from './DrawingToolbar'

export const Overlay: Component = () => {
	return (
		<div class="echo-overlay">
			<DrawingToolbar />
			<DrawingLayer />
		</div>
	)
}
