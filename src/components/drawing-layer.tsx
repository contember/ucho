import { type Component, createEffect, createMemo, For, on, onCleanup } from 'solid-js'
import { useStore } from '~/contexts'
import type { Point } from '~/types'
import { getRectFromPoints } from '~/utils/geometry'
import { DrawingTooltip } from './drawing-tooltip'
import { Shape } from './shape'
import { ShapeActions } from './shape-actions'

export const DrawingLayer: Component = () => {
	const store = useStore()
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

	// One finger draws; two pan and zoom the page, which `touch-action: pinch-zoom` on the
	// svg hands to the browser. So nothing here cancels a touch to stop scrolling, and a
	// second finger abandons whatever the first one started instead of drawing with it.
	//
	// The rest of a touch is followed on the element it started on, not on the svg. A touch
	// keeps its target for its whole life, and dragging a shape replaces that shape's
	// element on the first frame: from then on the events go to a detached node and never
	// bubble up, so a listener on the svg would lose the drag and never see it end.
	let stopFollowing: (() => void) | undefined

	const followTouch = (target: EventTarget, touchId: number) => {
		const ownsTouch = (e: TouchEvent) => [...e.changedTouches].some(touch => touch.identifier === touchId)

		const move = (e: TouchEvent) => {
			if (e.touches.length > 1) return
			store.drawing.methods.handleMove(e)
		}
		const end = (e: TouchEvent) => {
			if (!ownsTouch(e)) return
			// A tap is otherwise followed by emulated mouse events, which would run the start
			// and end of the same gesture a second time through the mouse handlers.
			e.preventDefault()
			stop()
			store.drawing.setState({ showTooltip: false })
			store.drawing.methods.handleEnd(e)
		}
		const cancel = (e: TouchEvent) => {
			if (!ownsTouch(e)) return
			stop()
			store.drawing.methods.cancelGesture()
		}
		const stop = () => {
			target.removeEventListener('touchmove', move as EventListener)
			target.removeEventListener('touchend', end as EventListener)
			target.removeEventListener('touchcancel', cancel as EventListener)
			stopFollowing = undefined
		}

		target.addEventListener('touchmove', move as EventListener)
		target.addEventListener('touchend', end as EventListener)
		target.addEventListener('touchcancel', cancel as EventListener)
		stopFollowing = stop
	}

	const handleTouchStart = (e: TouchEvent) => {
		if (e.touches.length > 1) {
			store.drawing.methods.cancelGesture()
			return
		}
		stopFollowing?.()
		if (e.target) followTouch(e.target, e.changedTouches[0].identifier)
		store.drawing.methods.handleStart(e)
		store.drawing.setState({ showTooltip: false, hasDrawn: true })
	}

	onCleanup(() => stopFollowing?.())

	return (
		<div
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
				on:touchstart={handleTouchStart}
				onMouseMove={store.drawing.methods.handleMove}
				onMouseUp={store.drawing.methods.handleEnd}
				onMouseEnter={store.drawing.methods.handleEnter}
				onMouseLeave={store.drawing.methods.handleLeave}
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
