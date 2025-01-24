import { createMemo } from 'solid-js'
import { useRootStore } from '~/contexts'
import { Shape } from '~/types'
import { getDistance, getPointFromEvent } from '../utils/events'
import { useDrag } from './useDrag'

const MOVEMENT_THRESHOLD = 5 // pixels

export const useDrawing = () => {
	const store = useRootStore()
	const drag = useDrag()

	// Create memoized values for frequently accessed store properties
	const selectedShapeId = createMemo(() => store.drawing.selectedShapeId)
	const currentShape = createMemo(() => {
		const id = selectedShapeId()
		return id ? store.drawing.shapes.find(s => s.id === id) : null
	})

	const handleShapeClick = (shapeId: string) => {
		store.setDrawing({
			selectedShapeId: selectedShapeId() === shapeId ? null : shapeId,
		})
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
				const shape = currentShape()
				if (shape && selectedShapeId() === shapeId) {
					drag.actions.startDrag(point)
					drag.actions.updateDragOffset(shape, point)
					return
				}
			}
		}

		// Store initial click position but don't start drawing yet
		drag.actions.setInitialClick(point)
	}

	const handleMove = (e: MouseEvent | TouchEvent) => {
		const point = getPointFromEvent(e)

		// Update mouse position for tooltip regardless of drawing state
		store.setDrawing({ mousePosition: point })

		if (drag.state.isDragging() && selectedShapeId() && drag.state.dragStartPos()) {
			// Handle shape dragging
			const shape = currentShape()
			if (shape) {
				const dx = point.x - drag.state.dragStartPos()!.x
				const dy = point.y - drag.state.dragStartPos()!.y

				const updatedShapes = store.drawing.shapes.map(s => {
					if (s.id === selectedShapeId()) {
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
				drag.actions.startDrag(point)
				return
			}
		}

		// Check if we should start drawing based on movement threshold
		const initialPos = drag.state.initialClickPos()
		if (initialPos && !store.drawing.isDrawing) {
			const distance = getDistance(initialPos, point)
			if (distance >= MOVEMENT_THRESHOLD) {
				// Unselect any selected shape when starting to draw
				store.setDrawing({
					isDrawing: true,
					currentPoints: [initialPos],
					selectedShapeId: null,
				})
				if (store.drawing.selectedTool === 'pen') {
					store.setDrawing({ currentPath: `M${initialPos.x},${initialPos.y}` })
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
		if (drag.state.isDragging()) {
			drag.actions.stopDrag()
			return
		}

		// If we have an initial click position and haven't started drawing,
		// check if we should handle it as a click (for shape selection)
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

		if (store.drawing.currentPoints.length < 2) {
			store.setDrawing({ isDrawing: false, currentPoints: [], currentPath: '' })
			return
		}

		const newShape: Shape = {
			id: Math.random().toString(36).substring(2),
			type: store.drawing.selectedTool === 'highlight' ? 'rectangle' : 'path',
			color: store.drawing.selectedColor,
			points: store.drawing.currentPoints,
		}

		store.setDrawing({ shapes: [...store.drawing.shapes, newShape], isDrawing: false, currentPoints: [], currentPath: '' })
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
