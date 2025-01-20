import { Component } from 'solid-js'
import { config } from '../config'
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

	const penCursor = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="${primaryColor.replace('#', '%23')}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="24" cy="24" r="8"/></svg>`

	const getCursor = () => {
		const tool = config[selectedTool()]
		if (tool.id === 'pen') {
			return `url('${penCursor}') 24 24, auto`
		}
		return tool.cursor
	}

	return (
		<div
			class="echo-overlay"
			onMouseDown={handleMouseDown}
			style={{
				cursor: getCursor(),
				opacity: isOpenStaggered() ? 1 : 0,
			}}
		>
			<DrawingToolbar />
			<DrawingLayer />
		</div>
	)
}
