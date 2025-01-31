import { type Component, For, onCleanup, onMount } from 'solid-js'
import { drawingConfig } from '~/config/drawingConfig'
import { useEchoStore } from '~/contexts'
import { generateCutoutPath, getPenCursor } from '../utils/svg'
import { DrawingTooltip } from './DrawingTooltip'
import { Shape } from './Shape'
import { ShapeActions } from './ShapeActions'

export const DrawingLayer: Component = () => {
	const store = useEchoStore()
	let drawingLayerContainerRef: HTMLDivElement | undefined

	onMount(() => {
		drawingLayerContainerRef?.addEventListener('mousemove', store.drawing.methods.handleMove)
		drawingLayerContainerRef?.addEventListener('mouseup', store.drawing.methods.handleEnd)
		drawingLayerContainerRef?.addEventListener('touchmove', store.drawing.methods.handleMove, { passive: false })
		drawingLayerContainerRef?.addEventListener('touchend', store.drawing.methods.handleEnd)
	})

	onCleanup(() => {
		drawingLayerContainerRef?.removeEventListener('mousemove', store.drawing.methods.handleMove)
		drawingLayerContainerRef?.removeEventListener('mouseup', store.drawing.methods.handleEnd)
		drawingLayerContainerRef?.removeEventListener('touchmove', store.drawing.methods.handleMove)
		drawingLayerContainerRef?.removeEventListener('touchend', store.drawing.methods.handleEnd)
	})

	const getCursor = () => {
		const tool = drawingConfig[store.drawing.state.selectedTool]
		if (tool.id === 'path') {
			return `url('${getPenCursor(store.drawing.state.selectedColor)}') 24 24, auto`
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
					store.drawing.methods.handleStart(e)
					store.drawing.setState({ showTooltip: false, hasDrawn: true })
				}}
				onTouchStart={e => {
					e.preventDefault() // Prevent scrolling while drawing
					store.drawing.methods.handleStart(e)
					store.drawing.methods.handleEnter(e)
					store.drawing.setState({ showTooltip: false, hasDrawn: true })
				}}
				onMouseMove={store.drawing.methods.handleMove}
				onTouchMove={e => {
					e.preventDefault() // Prevent scrolling while drawing
					store.drawing.methods.handleMove(e)
				}}
				onMouseEnter={store.drawing.methods.handleEnter}
				onMouseLeave={store.drawing.methods.handleLeave}
				onTouchEnd={store.drawing.methods.handleLeave}
			>
				{/* overlay mask */}
				<path
					class="echo-drawing-layer-mask"
					d={generateCutoutPath(
						{
							width: store.widget.state.dimensions.width,
							height: store.widget.state.dimensions.height,
						},
						store.drawing.state.currentPoints,
						store.drawing.state.shapes,
					)}
					fill="rgba(33, 43, 55, 1)"
					fill-opacity="0.2"
					fill-rule="evenodd"
				/>

				{/* already drawn shapes */}
				<For each={store.drawing.state.shapes}>
					{shape => (
						<Shape
							id={shape.id}
							type={shape.type}
							color={shape.color}
							points={shape.points}
							selectedShapeId={store.drawing.state.selectedShapeId}
							onShapeClick={store.drawing.methods.handleShapeClick}
						/>
					)}
				</For>

				{/* current shape */}
				<Shape
					id="temp"
					type={store.drawing.state.selectedTool}
					color={store.drawing.state.selectedColor}
					points={store.drawing.state.currentPoints}
					selectedShapeId={store.drawing.state.selectedShapeId}
				/>
			</svg>
		</div>
	)
}
