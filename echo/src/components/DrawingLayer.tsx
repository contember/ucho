import { Component, For, createSignal, onCleanup, onMount } from 'solid-js'
import { drawingConfig } from '../config/drawingConfig'
import { useRootStore } from '../contexts/RootContext'
import { Shape as ShapeType } from '../types'
import { renderShape } from '../utils/shape'
import { DrawingTooltip } from './DrawingTooltip'
import { Shape } from './Shape'
import { ShapeActions } from './ShapeActions'

export const DrawingLayer: Component = () => {
	const store = useRootStore()

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

	const handleStart = (e: MouseEvent | TouchEvent) => {
		// Accept events only on the drawing layer
		if (e instanceof MouseEvent) {
			const target = e.target as HTMLElement
			if (!target.classList.contains('echo-drawing-layer-mask')) {
				return
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

		const point = getPointFromEvent(e)

		store.setDrawing({ isDrawing: true })
		store.setDrawing({ currentPoints: [point] })

		if (store.drawing.selectedTool === 'pen') {
			store.setDrawing({ currentPath: `M${point.x},${point.y}` })
		}
	}

	const handleMove = (e: MouseEvent | TouchEvent) => {
		const point = getPointFromEvent(e)

		// Update mouse position for tooltip regardless of drawing state
		store.setDrawing({ mousePosition: point })

		if (!store.drawing.isDrawing) return

		if (store.drawing.selectedTool === 'highlight') {
			store.setDrawing({ currentPoints: [store.drawing.currentPoints[0], point] })
		} else if (store.drawing.selectedTool === 'pen') {
			store.setDrawing({ currentPath: `${store.drawing.currentPath} L${point.x},${point.y}` })
			store.setDrawing({ currentPoints: [...store.drawing.currentPoints, point] })
		}
	}

	const handleEnd = () => {
		if (store.drawing.currentPoints.length < 2) {
			store.setDrawing({ isDrawing: false })
			store.setDrawing({ currentPoints: [] })
			store.setDrawing({ currentPath: '' })
			return
		}

		const newShape: ShapeType = {
			id: Math.random().toString(36).substring(2),
			type: store.drawing.selectedTool === 'highlight' ? 'rectangle' : 'path',
			color: store.widget.primaryColor,
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

	const penCursor = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="${store.widget.primaryColor.replace('#', '%23')}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="24" cy="24" r="8"/></svg>`

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
							color: store.widget.primaryColor,
							points: store.drawing.currentPoints,
						},
						false,
					)}

				{store.drawing.currentPath && store.drawing.selectedTool === 'pen' && (
					<path
						d={store.drawing.currentPath}
						fill="none"
						stroke={store.widget.primaryColor}
						stroke-width={drawingConfig.pen.strokeWidth.active}
						stroke-linecap="round"
						style={{ opacity: store.drawing.isDrawing ? drawingConfig.pen.opacity.active : drawingConfig.pen.opacity.normal }}
					/>
				)}
			</svg>
		</div>
	)
}
