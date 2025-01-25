import { Component, For, onCleanup, onMount } from 'solid-js'
import { drawingConfig } from '~/config/drawingConfig'
import { useEchoStore } from '~/contexts'
import { renderShape } from '~/utils/shape'
import { useDrawing } from '../hooks/useDrawing'
import { generateCutoutPath, getPenCursor } from '../utils/svg'
import { DrawingTooltip } from './DrawingTooltip'
import { Shape } from './Shape'
import { ShapeActions } from './ShapeActions'

export const DrawingLayer: Component = () => {
	const store = useEchoStore()
	const drawing = useDrawing()

	onMount(() => {
		document.addEventListener('mousemove', drawing.actions.handleMove)
		document.addEventListener('mouseup', drawing.actions.handleEnd)
		document.addEventListener('touchmove', drawing.actions.handleMove, { passive: false })
		document.addEventListener('touchend', drawing.actions.handleEnd)
	})

	onCleanup(() => {
		document.removeEventListener('mousemove', drawing.actions.handleMove)
		document.removeEventListener('mouseup', drawing.actions.handleEnd)
		document.removeEventListener('touchmove', drawing.actions.handleMove)
		document.removeEventListener('touchend', drawing.actions.handleEnd)
	})

	const getCursor = () => {
		const tool = drawingConfig[drawing.state.selectedTool]
		if (tool.id === 'pen') {
			return `url('${getPenCursor(drawing.state.selectedColor)}') 24 24, auto`
		}
		return tool.cursor
	}

	return (
		<div
			class="echo-drawing-layer-container"
			style={{
				cursor: getCursor(),
			}}
		>
			<DrawingTooltip />
			<ShapeActions />

			<svg
				width="100%"
				height="100%"
				class="echo-drawing-layer"
				preserveAspectRatio="none"
				onMouseDown={e => {
					drawing.actions.handleStart(e)
					store.setDrawing({ showTooltip: false, hasDrawn: true })
				}}
				onTouchStart={e => {
					e.preventDefault() // Prevent scrolling while drawing
					drawing.actions.handleStart(e)
					drawing.actions.handleEnter(e)
					store.setDrawing({ showTooltip: false, hasDrawn: true })
				}}
				onMouseMove={drawing.actions.handleMove}
				onTouchMove={e => {
					e.preventDefault() // Prevent scrolling while drawing
					drawing.actions.handleMove(e)
				}}
				onMouseEnter={drawing.actions.handleEnter}
				onMouseLeave={drawing.actions.handleLeave}
				onTouchEnd={drawing.actions.handleLeave}
			>
				<path
					class="echo-drawing-layer-mask"
					d={generateCutoutPath(
						{
							width: document.documentElement.scrollWidth,
							height: document.documentElement.scrollHeight,
						},
						drawing.state.currentPoints,
						drawing.state.shapes,
					)}
					fill="rgba(33, 43, 55, 1)"
					fill-opacity="0.2"
					fill-rule="evenodd"
					style={{
						transition: 'opacity 0.3s ease-in-out',
						opacity: store.widget.isOpen ? 1 : 0,
					}}
				/>

				<For each={drawing.state.shapes}>
					{shape => (
						<Shape shape={shape} selectedShapeId={drawing.state.selectedShapeId} onShapeClick={drawing.actions.handleShapeClick} isMask={false} />
					)}
				</For>

				{drawing.state.currentPoints.length === 2 &&
					renderShape(
						{
							id: 'temp',
							type: 'rectangle',
							color: drawing.state.selectedColor,
							points: drawing.state.currentPoints,
						},
						false,
					)}

				{drawing.state.currentPath && drawing.state.selectedTool === 'pen' && (
					<path
						d={drawing.state.currentPath}
						fill="none"
						stroke={drawing.state.selectedColor}
						stroke-width={drawingConfig.pen.strokeWidth.active}
						stroke-linecap="round"
						style={{ opacity: drawing.state.isDrawing ? drawingConfig.pen.opacity.active : drawingConfig.pen.opacity.normal }}
					/>
				)}
			</svg>
		</div>
	)
}
