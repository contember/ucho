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
	let drawingLayerContainerRef: HTMLDivElement | undefined

	onMount(() => {
		drawingLayerContainerRef?.addEventListener('mousemove', drawing.actions.handleMove)
		drawingLayerContainerRef?.addEventListener('mouseup', drawing.actions.handleEnd)
		drawingLayerContainerRef?.addEventListener('touchmove', drawing.actions.handleMove, { passive: false })
		drawingLayerContainerRef?.addEventListener('touchend', drawing.actions.handleEnd)
	})

	onCleanup(() => {
		drawingLayerContainerRef?.removeEventListener('mousemove', drawing.actions.handleMove)
		drawingLayerContainerRef?.removeEventListener('mouseup', drawing.actions.handleEnd)
		drawingLayerContainerRef?.removeEventListener('touchmove', drawing.actions.handleMove)
		drawingLayerContainerRef?.removeEventListener('touchend', drawing.actions.handleEnd)
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
			ref={drawingLayerContainerRef}
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
							width: store.widget.dimensions.width,
							height: store.widget.dimensions.height,
						},
						drawing.state.currentPoints,
						drawing.state.shapes,
					)}
					fill="rgba(33, 43, 55, 1)"
					fill-opacity="0.2"
					fill-rule="evenodd"
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
