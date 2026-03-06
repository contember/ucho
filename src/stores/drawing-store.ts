import { createStore } from 'solid-js/store'
import { toolConfig } from '~/config/drawing-config'
import type { DrawingTool, FullConfig, Point, Shape } from '~/types'
import { loadPageState } from '~/utils'
import { getDistance, getPointFromEvent } from '~/utils/events'

const MOVEMENT_THRESHOLD = 5 // pixels

const computeCursor = (tool: DrawingTool, color: string) => {
	return toolConfig[tool].getCursor(color)
}

export type DrawingState = {
	isDrawing: boolean
	isResizing: boolean
	resizeAnchor: Point | null
	selectedShapeId: string | null
	selectedTool: DrawingTool
	selectedColor: string
	shapes: Shape[]
	currentPoints: Point[]
	showTooltip: boolean
	mousePosition: Point
	hasDrawn: boolean
	isDragging: boolean
	dragStartPos: Point | null
	initialClickPos: Point | null
	dragOffset: Point | null
	cursor: string
}

export type DrawingStore = {
	state: DrawingState
	setState: (state: Partial<DrawingState>, isClearing?: boolean) => void
	methods: {
		startDrawing: (initialPoint: Point) => void
		updateDrawing: (point: Point) => void
		finishDrawing: () => void
		handleShapeClick: (shapeId: string) => void
		handleStart: (e: MouseEvent | TouchEvent) => void
		handleMove: (e: MouseEvent | TouchEvent) => void
		handleEnd: (e: MouseEvent | TouchEvent) => void
		handleEnter: (e: MouseEvent | TouchEvent) => void
		handleLeave: (e: MouseEvent | TouchEvent) => void
		startResize: (anchor: Point) => void
		stopResize: () => void
		startDrag: (point: Point) => void
		stopDrag: () => void
		setInitialClick: (point: Point | null) => void
		updateDragOffset: (shape: { points: Point[] }, point: Point) => void
	}
}

const PATH_POINT_MIN_DISTANCE = 3 // minimum pixels between path points

export const createDrawingStore = (
	config: FullConfig,
	currentPageKey: string,
	onStateChange?: (state: Partial<DrawingState>, isClearing?: boolean) => void,
): DrawingStore => {
	let drawingRafId: number | undefined
	let pendingDrawPoint: Point | undefined

	const [state, setState] = createStore<DrawingState>({
		isDrawing: false,
		isResizing: false,
		resizeAnchor: null,
		currentPoints: [],
		selectedShapeId: null,
		selectedTool: 'rectangle',
		showTooltip: true,
		mousePosition: { x: 0, y: 0 },
		selectedColor: config.primaryColor,
		shapes: loadPageState(currentPageKey)?.drawing?.shapes || [],
		hasDrawn: false,
		isDragging: false,
		dragStartPos: null,
		initialClickPos: null,
		dragOffset: null,
		cursor: computeCursor('rectangle', config.primaryColor),
	})

	const NON_PERSISTENT_KEYS: Set<keyof DrawingState> = new Set([
		'mousePosition',
		'cursor',
		'showTooltip',
		'isDragging',
		'dragStartPos',
		'initialClickPos',
		'dragOffset',
		'isDrawing',
		'isResizing',
		'resizeAnchor',
		'currentPoints',
	])

	const wrappedSetState = (newState: Partial<DrawingState>, isClearing = false) => {
		if (newState.selectedTool || newState.selectedColor) {
			const tool = newState.selectedTool || state.selectedTool
			const color = newState.selectedColor || state.selectedColor
			newState.cursor = computeCursor(tool, color)
		}
		setState(newState)
		const hasPersistentChange = Object.keys(newState).some(key => !NON_PERSISTENT_KEYS.has(key as keyof DrawingState))
		if (hasPersistentChange) {
			onStateChange?.(newState, isClearing)
		}
	}

	const methods = {
		startDrawing: (initialPoint: Point) => {
			wrappedSetState({
				isDrawing: true,
				currentPoints: [initialPoint],
				selectedShapeId: null,
			})
		},
		updateDrawing: (point: Point) => {
			if (state.selectedTool === 'rectangle') {
				wrappedSetState({ currentPoints: [state.currentPoints[0], point] })
			} else if (state.selectedTool === 'path') {
				const lastPoint = state.currentPoints[state.currentPoints.length - 1]
				if (lastPoint && getDistance(lastPoint, point) < PATH_POINT_MIN_DISTANCE) return
				wrappedSetState({
					currentPoints: [...state.currentPoints, point],
				})
			}
		},
		finishDrawing: () => {
			if (state.currentPoints.length >= 2) {
				const newShape: Shape = {
					id: Math.random().toString(36).substring(2),
					type: state.selectedTool,
					color: state.selectedColor,
					points: state.currentPoints,
				}
				wrappedSetState({ shapes: [...state.shapes, newShape] })
			}
			wrappedSetState({ isDrawing: false, currentPoints: [] })
		},
		handleShapeClick: (shapeId: string) => {
			wrappedSetState({
				selectedShapeId: state.selectedShapeId === shapeId ? null : shapeId,
			})
		},
		handleStart: (e: MouseEvent | TouchEvent) => {
			if (e instanceof MouseEvent) {
				const target = e.target as HTMLElement
				if (
					!target.classList.contains('ucho-drawing-layer') && !target.classList.contains('ucho-shape')
					&& !target.classList.contains('ucho-resize-handle')
				) {
					return
				}
			}

			const point = getPointFromEvent(e)

			// Clicked on a resize handle → start resizing
			if (e.target instanceof SVGElement && e.target.classList.contains('ucho-resize-handle')) {
				const anchorX = parseFloat(e.target.dataset.anchorX || '0')
				const anchorY = parseFloat(e.target.dataset.anchorY || '0')
				methods.startResize({ x: anchorX, y: anchorY })
				methods.setInitialClick(point)
				return
			}

			// Clicked on a shape → select it and prepare for potential drag
			if (e.target instanceof SVGElement && e.target.classList.contains('ucho-shape')) {
				const shapeId = e.target.dataset.shapeId
				if (shapeId) {
					const shape = state.shapes.find(s => s.id === shapeId)
					if (shape) {
						wrappedSetState({ selectedShapeId: shapeId })
						methods.setInitialClick(point)
						return
					}
				}
			}

			// Clicked on empty area → deselect and prepare for new drawing
			wrappedSetState({ selectedShapeId: null })
			methods.setInitialClick(point)
		},
		handleMove: (e: MouseEvent | TouchEvent) => {
			const point = getPointFromEvent(e)

			if (!state.isDrawing && !state.isResizing && !state.isDragging && !state.initialClickPos) {
				if (state.showTooltip) {
					const clientPoint = getPointFromEvent(e, { useClientCoords: true })
					wrappedSetState({ mousePosition: clientPoint })
				}
				return
			}

			// Threshold check runs immediately (no RAF) so drawing starts responsively
			if (state.initialClickPos && !state.isDrawing && !state.isResizing && !state.isDragging) {
				const distance = getDistance(state.initialClickPos, point)
				if (distance >= MOVEMENT_THRESHOLD) {
					if (state.selectedShapeId) {
						const shape = state.shapes.find(s => s.id === state.selectedShapeId)
						if (shape) {
							methods.startDrag(state.initialClickPos)
							methods.updateDragOffset(shape, state.initialClickPos)
							return
						}
					}
					methods.startDrawing(state.initialClickPos)
				}
				return
			}

			// Batch actual drawing/resize/drag updates with RAF
			pendingDrawPoint = point
			if (drawingRafId !== undefined) return
			drawingRafId = requestAnimationFrame(() => {
				drawingRafId = undefined
				const p = pendingDrawPoint!
				pendingDrawPoint = undefined

				if (state.isResizing && state.selectedShapeId && state.resizeAnchor) {
					const updatedShapes = state.shapes.map(s => {
						if (s.id === state.selectedShapeId) {
							return { ...s, points: [state.resizeAnchor!, p] }
						}
						return s
					})
					wrappedSetState({ shapes: updatedShapes })
					return
				}

				if (state.isDragging && state.selectedShapeId && state.dragStartPos) {
					const shape = state.shapes.find(s => s.id === state.selectedShapeId)
					if (shape) {
						const dx = p.x - state.dragStartPos.x
						const dy = p.y - state.dragStartPos.y
						const updatedShapes = state.shapes.map(s => {
							if (s.id === state.selectedShapeId) {
								return {
									...s,
									points: s.points.map(pt => ({
										x: pt.x + dx,
										y: pt.y + dy,
									})),
								}
							}
							return s
						})
						wrappedSetState({ shapes: updatedShapes })
						methods.startDrag(p)
						return
					}
				}

				if (state.isDrawing) {
					methods.updateDrawing(p)
				}
			})
		},
		handleEnd: (_e: MouseEvent | TouchEvent) => {
			if (state.isResizing) {
				methods.stopResize()
				methods.setInitialClick(null)
				return
			}

			if (state.isDragging) {
				methods.stopDrag()
				methods.setInitialClick(null)
				return
			}

			methods.setInitialClick(null)

			if (state.isDrawing) {
				methods.finishDrawing()
			}
		},
		handleEnter: (e: MouseEvent | TouchEvent) => {
			if (e.target === e.currentTarget && !state.hasDrawn) {
				wrappedSetState({ showTooltip: true })
			}
		},
		handleLeave: (e: MouseEvent | TouchEvent) => {
			if (e.target === e.currentTarget) {
				wrappedSetState({ showTooltip: false })
			}
		},
		startResize: (anchor: Point) => {
			wrappedSetState({
				isResizing: true,
				resizeAnchor: anchor,
			})
		},
		stopResize: () => {
			wrappedSetState({
				isResizing: false,
				resizeAnchor: null,
			})
		},
		startDrag: (point: Point) => {
			wrappedSetState({
				isDragging: true,
				dragStartPos: point,
			})
		},
		stopDrag: () => {
			wrappedSetState({
				isDragging: false,
				dragStartPos: null,
				dragOffset: null,
			})
		},
		setInitialClick: (point: Point | null) => {
			wrappedSetState({
				initialClickPos: point,
			})
		},
		updateDragOffset: (shape: { points: Point[] }, point: Point) => {
			wrappedSetState({
				dragOffset: {
					x: point.x - shape.points[0].x,
					y: point.y - shape.points[0].y,
				},
			})
		},
	}

	return {
		state,
		setState: wrappedSetState,
		methods,
	}
}
