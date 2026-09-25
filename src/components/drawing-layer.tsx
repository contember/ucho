import { type Component, createEffect, createMemo, For, on, onCleanup, onMount } from 'solid-js'
import { useStore } from '~/contexts'
import type { Point } from '~/types'
import { getRectFromPoints } from '~/utils/geometry'
import { DrawingTooltip } from './drawing-tooltip'
import { Shape } from './shape'
import { ShapeActions } from './shape-actions'

export const DrawingLayer: Component = () => {
	const store = useStore()
	let drawingLayerContainerRef: HTMLDivElement | undefined
	let canvasRef: HTMLCanvasElement | undefined

	// The rectangles cut out of the dimmed canvas. Only these affect it, so the canvas is
	// redrawn when they change and not on every other shape update: drawing a freehand path
	// or dragging one rewrites `shapes` on every frame and would otherwise repaint a canvas
	// the size of the whole page each time. A shape that did not move keeps its `points`
	// array, which is what the comparison relies on.
	const cutouts = createMemo(
		() => {
			const rects = store.drawing.state.shapes.filter(shape => shape.type === 'rectangle').map(shape => shape.points)
			const current = store.drawing.state.currentPoints
			if (store.drawing.state.selectedTool === 'rectangle' && current.length === 2) rects.push(current)
			return rects
		},
		[] as Point[][],
		{ equals: (a, b) => a.length === b.length && a.every((points, i) => points === b[i]) },
	)

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

		// Cut out the rectangles, including the one being drawn
		ctx.fillStyle = 'rgba(0, 0, 0, 1)'
		for (const points of cutouts()) {
			const r = getRectFromPoints(points)
			if (r) ctx.fillRect(r.x, r.y, r.width, r.height)
		}

		ctx.globalCompositeOperation = 'source-over'
	}

	// Also runs once on mount, which is the first paint of the canvas.
	createEffect(on([cutouts, () => store.widget.state.dimensions], drawOverlay))

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
