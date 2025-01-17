import { Component } from 'solid-js'
import { Portal } from 'solid-js/web'
import { useDrawing } from '../contexts/DrawingContext'
import { useWidget } from '../contexts/WidgetContext'
import { DrawingLayer } from './DrawingLayer'

export const Overlay: Component = () => {
	const { primaryColor, isOverlayVisible } = useWidget()
	const {
		handlers: { handleMouseDown },
	} = useDrawing()

	return (
		<Portal useShadow>
			<div
				class="echo-overlay"
				onMouseDown={handleMouseDown}
				style={{
					position: 'fixed',
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					border: `4px solid ${primaryColor}`,
					cursor: 'crosshair',
					transition: 'opacity 0.3s ease-in-out',
					opacity: isOverlayVisible() ? 1 : 0,
				}}
			>
				<DrawingLayer />
			</div>
		</Portal>
	)
}
