import { createEffect, createSignal } from 'solid-js'
import { useEchoStore } from '~/contexts'
import { Point } from '~/types'

export const useDrag = () => {
	const store = useEchoStore()
	const [isDragging, setIsDragging] = createSignal(false)
	const [dragStartPos, setDragStartPos] = createSignal<Point | null>(null)
	const [initialClickPos, setInitialClickPos] = createSignal<Point | null>(null)
	const [dragOffset, setDragOffset] = createSignal<Point | null>(null)

	// Sync store values with local signals
	createEffect(() => {
		setIsDragging(store.drawing.isDragging)
		setDragStartPos(store.drawing.dragStartPos)
		setInitialClickPos(store.drawing.initialClickPos)
		setDragOffset(store.drawing.dragOffset)
	})

	const startDrag = (point: Point) => {
		store.setDrawing({
			isDragging: true,
			dragStartPos: point,
		})
	}

	const updateDragOffset = (shape: { points: Point[] }, point: Point) => {
		store.setDrawing({
			dragOffset: {
				x: point.x - shape.points[0].x,
				y: point.y - shape.points[0].y,
			},
		})
	}

	const stopDrag = () => {
		store.setDrawing({
			isDragging: false,
			dragStartPos: null,
			dragOffset: null,
		})
	}

	const setInitialClick = (point: Point | null) => {
		store.setDrawing({
			initialClickPos: point,
		})
	}

	return {
		state: {
			isDragging,
			dragStartPos,
			initialClickPos,
			dragOffset,
		},
		actions: {
			startDrag,
			stopDrag,
			setInitialClick,
			updateDragOffset,
		},
	}
}
