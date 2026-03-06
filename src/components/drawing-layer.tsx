import { type Component, createEffect, For, on, onCleanup, onMount } from 'solid-js'
import { useStore } from '~/contexts'
import { getRectFromPoints } from '~/utils/geometry'
import { DrawingTooltip } from './drawing-tooltip'
import { Shape } from './shape'
import { ShapeActions } from './shape-actions'

export const DrawingLayer: Component = () => {
	const store = useStore()
	let drawingLayerContainerRef: HTMLDivElement | undefined
	let canvasRef: HTMLCanvasElement | undefined

	const drawOverlay = () => {
		const canvas = canvasRef
		if (!canvas) return

		const parent = canvas.parentElement
		if (!parent) return

		const width = parent.clientWidth
		const height = parent.clientHeight

		if (canvas.width !== width || canvas.height !== height) {
			canvas.width = width
			canvas.height = height
		}

		const ctx = canvas.getContext('2d')
		if (!ctx) return

		ctx.clearRect(0, 0, width, height)

		// Draw semi-transparent overlay
		ctx.fillStyle = 'rgba(33, 43, 55, 0.2)'
		ctx.fillRect(0, 0, width, height)

		// Cut out rectangle shapes
		ctx.globalCompositeOperation = 'destination-out'

		// Cut out existing rectangle shapes
		for (const shape of store.drawing.state.shapes) {
			if (shape.type !== 'rectangle') continue
			const r = getRectFromPoints(shape.points)
			if (r) {
				ctx.fillStyle = 'rgba(0, 0, 0, 1)'
				ctx.fillRect(r.x, r.y, r.width, r.height)
			}
		}

		// Cut out current drawing (if rectangle with 2 points)
		if (store.drawing.state.currentPoints.length === 2 && store.drawing.state.selectedTool === 'rectangle') {
			const r = getRectFromPoints(store.drawing.state.currentPoints)
			if (r) {
				ctx.fillStyle = 'rgba(0, 0, 0, 1)'
				ctx.fillRect(r.x, r.y, r.width, r.height)
			}
		}

		ctx.globalCompositeOperation = 'source-over'
	}

	createEffect(on(
		() => [
			store.drawing.state.shapes,
			store.drawing.state.currentPoints,
			store.drawing.state.selectedTool,
			store.widget.state.dimensions,
		],
		() => {
			drawOverlay()
		},
	))

	onMount(() => {
		drawingLayerContainerRef?.addEventListener('touchmove', store.drawing.methods.handleMove, { passive: false })
		drawingLayerContainerRef?.addEventListener('touchend', store.drawing.methods.handleEnd)
		drawOverlay()
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

			<canvas
				ref={canvasRef}
				class="ucho-drawing-overlay-canvas"
				aria-hidden="true"
			/>

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
