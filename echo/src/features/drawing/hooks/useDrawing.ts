import { createMemo } from 'solid-js'
import { useEchoStore } from '~/contexts'
import type { Point, Shape } from '~/types'
import { getDistance, getPointFromEvent } from '../utils/events'
import { useDrag } from './useDrag'

const MOVEMENT_THRESHOLD = 5 // pixels

export const useDrawing = () => {
	const store = useEchoStore()
	const drag = useDrag()

	// Memoized selectors
	const selectedShapeId = createMemo(() => store.drawing.selectedShapeId)
	const currentShape = createMemo(() => {
		const id = selectedShapeId()
		return id ? store.drawing.shapes.find(s => s.id === id) : null
	})

	// Shape management
	const updateShapePosition = (shape: Shape, dx: number, dy: number) => {
		return {
			...shape,
			points: shape.points.map(p => ({
				x: p.x + dx,
				y: p.y + dy,
			})),
		}
	}

	const createNewShape = (points: Point[]): Shape => ({
		id: Math.random().toString(36).substring(2),
		type: store.drawing.selectedTool === 'highlight' ? 'rectangle' : 'path',
		color: store.drawing.selectedColor,
		points,
	})

	// Drawing state management
	const startDrawing = (initialPoint: Point) => {
		store.setDrawing({
			isDrawing: true,
			currentPoints: [initialPoint],
			selectedShapeId: null,
		})
		if (store.drawing.selectedTool === 'pen') {
			store.setDrawing({ currentPath: `M${initialPoint.x},${initialPoint.y}` })
		}
	}

	const updateDrawing = (point: Point) => {
		if (store.drawing.selectedTool === 'highlight') {
			store.setDrawing({ currentPoints: [store.drawing.currentPoints[0], point] })
		} else if (store.drawing.selectedTool === 'pen') {
			store.setDrawing({
				currentPath: `${store.drawing.currentPath} L${point.x},${point.y}`,
				currentPoints: [...store.drawing.currentPoints, point],
			})
		}
	}

	const finishDrawing = () => {
		if (store.drawing.currentPoints.length >= 2) {
			const newShape = createNewShape(store.drawing.currentPoints)
			store.setDrawing({ shapes: [...store.drawing.shapes, newShape] })
		}
		store.setDrawing({ isDrawing: false, currentPoints: [], currentPath: '' })
	}

	// Event handlers
	const handleShapeClick = (shapeId: string) => {
		store.setDrawing({
			selectedShapeId: selectedShapeId() === shapeId ? null : shapeId,
		})
	}

	const handleStart = (e: MouseEvent | TouchEvent) => {
		if (e instanceof MouseEvent) {
			const target = e.target as HTMLElement
			if (!target.classList.contains('echo-drawing-layer-mask') && !target.classList.contains('echo-shape')) {
				return
			}
		}

		const point = getPointFromEvent(e)

		if (e.target instanceof SVGElement && e.target.classList.contains('echo-shape')) {
			const shapeId = e.target.dataset.shapeId
			if (shapeId && selectedShapeId() === shapeId) {
				const shape = currentShape()
				if (shape) {
					drag.actions.startDrag(point)
					drag.actions.updateDragOffset(shape, point)
					return
				}
			}
		}

		drag.actions.setInitialClick(point)
	}

	const handleMove = (e: MouseEvent | TouchEvent) => {
		const clientPoint = getPointFromEvent(e, { useClientCoords: true })
		const point = getPointFromEvent(e)

		store.setDrawing({ mousePosition: clientPoint })

		// Handle shape dragging
		if (drag.state.isDragging() && selectedShapeId() && drag.state.dragStartPos()) {
			const shape = currentShape()
			if (shape) {
				const dx = point.x - drag.state.dragStartPos()!.x
				const dy = point.y - drag.state.dragStartPos()!.y

				const updatedShapes = store.drawing.shapes.map(s => (s.id === selectedShapeId() ? updateShapePosition(s, dx, dy) : s))

				store.setDrawing({ shapes: updatedShapes })
				drag.actions.startDrag(point)
				return
			}
		}

		// Handle drawing initiation
		const initialPos = drag.state.initialClickPos()
		if (initialPos && !store.drawing.isDrawing) {
			const distance = getDistance(initialPos, point)
			if (distance >= MOVEMENT_THRESHOLD) {
				startDrawing(initialPos)
			}
			return
		}

		// Update current drawing
		if (store.drawing.isDrawing) {
			updateDrawing(point)
		}
	}

	const handleEnd = (e: MouseEvent | TouchEvent) => {
		if (drag.state.isDragging()) {
			drag.actions.stopDrag()
			return
		}

		const initialPos = drag.state.initialClickPos()
		if (initialPos && !store.drawing.isDrawing) {
			const point = getPointFromEvent(e)
			const distance = getDistance(initialPos, point)
			if (distance < MOVEMENT_THRESHOLD && e.target instanceof SVGElement && e.target.classList.contains('echo-shape')) {
				const shapeId = e.target.dataset.shapeId
				if (shapeId) {
					store.setDrawing({ selectedShapeId: shapeId })
				}
			}
		}

		drag.actions.setInitialClick(null)
		finishDrawing()
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

	return {
		state: store.drawing,
		actions: {
			handleStart,
			handleMove,
			handleEnd,
			handleEnter,
			handleLeave,
			handleShapeClick,
		},
	}
}
