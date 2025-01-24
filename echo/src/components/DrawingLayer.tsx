import { Component, For, createSignal, onCleanup, onMount } from 'solid-js'
import { drawingConfig } from '../config/drawingConfig'
import { useRootStore } from '../contexts/RootContext'
import { Point, Shape as ShapeType } from '../types'
import { renderShape } from '../utils/shape'
import { DrawingTooltip } from './DrawingTooltip'
import { Shape } from './Shape'
import { ShapeActions } from './ShapeActions'

export const DrawingLayer: Component = () => {
	const store = useRootStore()
	const [isDragging, setIsDragging] = createSignal(false)
	const [dragStartPos, setDragStartPos] = createSignal<Point | null>(null)
	const [initialClickPos, setInitialClickPos] = createSignal<Point | null>(null)
	const [dragOffset, setDragOffset] = createSignal<Point | null>(null)
	const MOVEMENT_THRESHOLD = 5 // pixels

	const [viewportWidth, setViewportWidth] = createSignal(window.innerWidth)
	const [viewportHeight, setViewportHeight] = createSignal(window.innerHeight)

	const handleResize = () => {
		setViewportWidth(window.innerWidth)
		setViewportHeight(window.innerHeight)
	}

	const getPointFromEvent = (e: MouseEvent | TouchEvent) => {
		const touch = e instanceof TouchEvent ? e.touches[0] : null
		return {
			x: touch ? touch.clientX : (e as MouseEvent).clientX,
			y: touch ? touch.clientY : (e as MouseEvent).clientY,
		}
	}

	const getDistance = (p1: Point, p2: Point) => {
		const dx = p2.x - p1.x
		const dy = p2.y - p1.y
		return Math.sqrt(dx * dx + dy * dy)
	}

	const handleStart = (e: MouseEvent | TouchEvent) => {
		// Accept events only on the drawing layer
		if (e instanceof MouseEvent) {
			const target = e.target as HTMLElement
			if (!target.classList.contains('echo-drawing-layer-mask') && !target.classList.contains('echo-shape')) {
				return
			}
		}

		const point = getPointFromEvent(e)

		// Check if clicking on a shape
		if (e.target instanceof SVGElement && e.target.classList.contains('echo-shape')) {
			const shapeId = e.target.dataset.shapeId
			if (shapeId) {
				const shape = store.drawing.shapes.find(s => s.id === shapeId)
				if (shape && store.drawing.selectedShapeId === shapeId) {
					setIsDragging(true)
					setDragStartPos(point)
					// Calculate offset from shape's first point
					setDragOffset({
						x: point.x - shape.points[0].x,
						y: point.y - shape.points[0].y,
					})
					return
				}
			}
		}

		if (e instanceof MouseEvent && e.button === 2) {
			// Right click
			if (store.drawing.selectedShapeId) {
				store.setDrawing({ shapes: store.drawing.shapes.filter(shape => shape.id !== store.drawing.selectedShapeId) })
				store.setDrawing({ selectedShapeId: null })
			}
			return
		}

		// Store initial click position but don't start drawing yet
		setInitialClickPos(point)
	}

	const handleMove = (e: MouseEvent | TouchEvent) => {
		const point = getPointFromEvent(e)

		// Update mouse position for tooltip regardless of drawing state
		store.setDrawing({ mousePosition: point })

		if (isDragging() && store.drawing.selectedShapeId && dragStartPos()) {
			// Handle shape dragging
			const shape = store.drawing.shapes.find(s => s.id === store.drawing.selectedShapeId)
			if (shape) {
				const dx = point.x - dragStartPos()!.x
				const dy = point.y - dragStartPos()!.y

				const updatedShapes = store.drawing.shapes.map(s => {
					if (s.id === store.drawing.selectedShapeId) {
						return {
							...s,
							points: s.points.map(p => ({
								x: p.x + dx,
								y: p.y + dy,
							})),
						}
					}
					return s
				})

				store.setDrawing({ shapes: updatedShapes })
				setDragStartPos(point)
				return
			}
		}

		// Check if we should start drawing based on movement threshold
		if (initialClickPos() && !store.drawing.isDrawing) {
			const distance = getDistance(initialClickPos()!, point)
			if (distance >= MOVEMENT_THRESHOLD) {
				// Unselect any selected shape when starting to draw
				store.setDrawing({
					isDrawing: true,
					currentPoints: [initialClickPos()!],
					selectedShapeId: null,
				})
				if (store.drawing.selectedTool === 'pen') {
					store.setDrawing({ currentPath: `M${initialClickPos()!.x},${initialClickPos()!.y}` })
				}
			}
			return
		}

		if (!store.drawing.isDrawing) return

		if (store.drawing.selectedTool === 'highlight') {
			store.setDrawing({ currentPoints: [store.drawing.currentPoints[0], point] })
		} else if (store.drawing.selectedTool === 'pen') {
			store.setDrawing({ currentPath: `${store.drawing.currentPath} L${point.x},${point.y}` })
			store.setDrawing({ currentPoints: [...store.drawing.currentPoints, point] })
		}
	}

	const handleEnd = (e: MouseEvent | TouchEvent) => {
		if (isDragging()) {
			setIsDragging(false)
			setDragStartPos(null)
			return
		}

		// If we have an initial click position and haven't started drawing,
		// check if we should handle it as a click (for shape selection)
		if (initialClickPos() && !store.drawing.isDrawing) {
			const point = getPointFromEvent(e)
			const distance = getDistance(initialClickPos()!, point)

			if (distance < MOVEMENT_THRESHOLD && e.target instanceof SVGElement && e.target.classList.contains('echo-shape')) {
				const shapeId = e.target.dataset.shapeId
				if (shapeId) {
					store.setDrawing({ selectedShapeId: shapeId })
				}
			}
		}

		setInitialClickPos(null)

		if (store.drawing.currentPoints.length < 2) {
			store.setDrawing({ isDrawing: false })
			store.setDrawing({ currentPoints: [] })
			store.setDrawing({ currentPath: '' })
			return
		}

		const newShape: ShapeType = {
			id: Math.random().toString(36).substring(2),
			type: store.drawing.selectedTool === 'highlight' ? 'rectangle' : 'path',
			color: store.drawing.selectedColor,
			points: store.drawing.currentPoints,
		}

		store.setDrawing({ shapes: [...store.drawing.shapes, newShape] })
		store.setDrawing({ isDrawing: false })
		store.setDrawing({ currentPoints: [] })
		store.setDrawing({ currentPath: '' })
	}

	onMount(() => {
		document.addEventListener('mousemove', handleMove)
		document.addEventListener('mouseup', handleEnd)
		document.addEventListener('touchmove', handleMove, { passive: false })
		document.addEventListener('touchend', handleEnd)
		window.addEventListener('resize', handleResize)
	})

	onCleanup(() => {
		document.removeEventListener('mousemove', handleMove)
		document.removeEventListener('mouseup', handleEnd)
		document.removeEventListener('touchmove', handleMove)
		document.removeEventListener('touchend', handleEnd)
		window.removeEventListener('resize', handleResize)
	})

	const generateCutoutPath = () => {
		let path = `M0 0 H${viewportWidth()} V${viewportHeight()} H0 Z`

		if (store.drawing.currentPoints.length === 2) {
			const [start, end] = store.drawing.currentPoints
			path += ` M${start.x} ${start.y} h${end.x - start.x} v${end.y - start.y} h${start.x - end.x} v${start.y - end.y}`
		}

		for (const shape of store.drawing.shapes) {
			if (shape.type === 'rectangle') {
				const [start, end] = shape.points
				path += ` M${start.x} ${start.y} h${end.x - start.x} v${end.y - start.y} h${start.x - end.x} v${start.y - end.y}`
			}
		}

		return path
	}

	const handleEnter = (e: MouseEvent | TouchEvent) => {
		if (e.target === e.currentTarget && !store.drawing.hasDrawn) {
			store.setDrawing({ showTooltip: true })
		}
	}

	const handleLeave = (e: MouseEvent | TouchEvent) => {
		if (e.target === e.currentTarget) {
			store.setDrawing({ showTooltip: false })
		}
	}

	const penCursor = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="${store.drawing.selectedColor.replace('#', '%23')}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="24" cy="24" r="8"/></svg>`

	const getCursor = () => {
		const tool = drawingConfig[store.drawing.selectedTool]
		if (tool.id === 'pen') {
			return `url('${penCursor}') 24 24, auto`
		}
		return tool.cursor
	}

	const handleShapeClick = (shapeId: string) => {
		store.setDrawing({
			selectedShapeId: store.drawing.selectedShapeId === shapeId ? null : shapeId,
		})
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
					handleStart(e)
					store.setDrawing({ showTooltip: false })
					store.setDrawing({ hasDrawn: true })
				}}
				onTouchStart={e => {
					e.preventDefault() // Prevent scrolling while drawing
					handleStart(e)
					handleEnter(e)
					store.setDrawing({ showTooltip: false })
					store.setDrawing({ hasDrawn: true })
				}}
				onMouseMove={handleMove}
				onTouchMove={e => {
					e.preventDefault() // Prevent scrolling while drawing
					handleMove(e)
				}}
				onMouseEnter={handleEnter}
				onMouseLeave={handleLeave}
				onTouchEnd={handleLeave}
			>
				<path
					class="echo-drawing-layer-mask"
					d={generateCutoutPath()}
					fill="rgba(33, 43, 55, 1)"
					fill-opacity="0.2"
					fill-rule="evenodd"
					style={{
						transition: 'opacity 0.3s ease-in-out',
						opacity: store.widget.isOpen ? 1 : 0,
					}}
				/>

				<For each={store.drawing.shapes}>
					{shape => <Shape shape={shape} selectedShapeId={store.drawing.selectedShapeId} onShapeClick={handleShapeClick} isMask={false} />}
				</For>

				{store.drawing.currentPoints.length === 2 &&
					renderShape(
						{
							id: 'temp',
							type: 'rectangle',
							color: store.drawing.selectedColor,
							points: store.drawing.currentPoints,
						},
						false,
					)}

				{store.drawing.currentPath && store.drawing.selectedTool === 'pen' && (
					<path
						d={store.drawing.currentPath}
						fill="none"
						stroke={store.drawing.selectedColor}
						stroke-width={drawingConfig.pen.strokeWidth.active}
						stroke-linecap="round"
						style={{ opacity: store.drawing.isDrawing ? drawingConfig.pen.opacity.active : drawingConfig.pen.opacity.normal }}
					/>
				)}
			</svg>
		</div>
	)
}
