import { type Component, For, onCleanup, onMount, Show } from 'solid-js'
import { useStore } from '~/contexts'
import { getRectFromPoints } from '~/utils/geometry'
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
				onMouseUp={store.drawing.methods.handleEnd}
				onMouseEnter={store.drawing.methods.handleEnter}
				onMouseLeave={store.drawing.methods.handleLeave}
				onTouchEnd={store.drawing.methods.handleLeave}
			>
				{/* overlay mask — uses SVG mask so overlapping cutouts stay transparent */}
				<defs>
					<mask id="ucho-overlay-mask">
						<rect width="100%" height="100%" fill="white" />
						<Show when={store.drawing.state.currentPoints.length === 2}>
							{(() => {
								const r = getRectFromPoints(store.drawing.state.currentPoints)
								return r ? <rect x={r.x} y={r.y} width={r.width} height={r.height} fill="black" /> : null
							})()}
						</Show>
						<For each={store.drawing.state.shapes}>
							{shape => {
								if (shape.type !== 'rectangle') return null
								const r = getRectFromPoints(shape.points)
								return r ? <rect x={r.x} y={r.y} width={r.width} height={r.height} fill="black" /> : null
							}}
						</For>
					</mask>
				</defs>
				<rect
					class="ucho-drawing-layer-mask"
					width="100%"
					height="100%"
					fill="rgba(33, 43, 55, 0.2)"
					mask="url(#ucho-overlay-mask)"
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
