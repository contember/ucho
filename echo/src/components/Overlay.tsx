import { Component } from 'solid-js'
import { Portal } from 'solid-js/web'
import { useDrawing } from '../contexts/DrawingContext'
import { useWidget } from '../contexts/WidgetContext'
import { DrawingLayer } from './DrawingLayer'
import { DrawingToolbar } from './DrawingToolbar'

export const Overlay: Component = () => {
	const { primaryColor, isOpenStaggered } = useWidget()
	const {
		handlers: { handleMouseDown },
		state: { selectedTool },
	} = useDrawing()

	const penCursor = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="%23000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="24" cy="24" r="8"/></svg>`

	return (
		<Portal useShadow>
			<div class="echo-overlay-container" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, border: `4px solid ${primaryColor}` }}>
				<div
					class="echo-overlay"
					onMouseDown={handleMouseDown}
					style={{
						position: 'fixed',
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						cursor: selectedTool() === 'highlight' ? 'crosshair' : `url('${penCursor}') 24 24, auto`,
						transition: 'opacity 0.3s ease-in-out',
						opacity: isOpenStaggered() ? 1 : 0,
					}}
				>
					<DrawingToolbar />
					<DrawingLayer />
				</div>
			</div>
		</Portal>
	)
}
