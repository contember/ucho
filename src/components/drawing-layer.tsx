import { type Component, For, onCleanup, onMount } from 'solid-js'
import { useStore } from '~/contexts'
import { generateCutoutPath } from '~/utils/svg'
import { DrawingTooltip } from './drawing-tooltip'
import { Shape } from './shape'
import { ShapeActions } from './shape-actions'

export const DrawingLayer: Component = () => {
	const store = useStore()
	let drawingLayerContainerRef: HTMLDivElement | undefined

	onMount(() => {
		drawingLayerContainerRef?.addEventListener('touchmove', store.drawing.methods.handleMove, { passive: false })
		drawingLayerContainerRef?.addEventListener('touchend', store.drawing.methods.handleEnd)
	})

	onCleanup(() => {
		drawingLayerContainerRef?.removeEventListener('touchmove', store.drawing.methods.handleMove)
		drawingLayerContainerRef?.removeEventListener('touchend', store.drawing.methods.handleEnd)
	})

	return (
		<div
			ref={drawingLayerContainerRef}
			class="ucho-drawing-layer-container"
			style={{
				cursor: store.drawing.state.cursor,
			}}
			role="application"
			aria-label="Drawing Canvas"
		>
			<DrawingTooltip />
			<ShapeActions />

			<svg
				width="100%"
				height="100%"
				class="ucho-drawing-layer"
				preserveAspectRatio="none"
				role="img"
				aria-label="Drawing Area"
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
					class="ucho-drawing-layer-mask"
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
					aria-hidden="true"
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
