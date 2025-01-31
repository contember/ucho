import { createStore } from 'solid-js/store'
import { toolConfig } from '~/config/drawingConfig'
import type { DrawingTool, FullEchoOptions, Point, Shape } from '~/types'
import { loadPageState } from '~/utils'
import { getDistance, getPointFromEvent } from '~/utils/events'

const MOVEMENT_THRESHOLD = 5 // pixels

const computeCursor = (tool: DrawingTool, color: string) => {
	return toolConfig[tool].getCursor(color)
}

export interface DrawingState {
	isDrawing: boolean
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

export interface DrawingStore {
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
		startDrag: (point: Point) => void
		stopDrag: () => void
		setInitialClick: (point: Point | null) => void
		updateDragOffset: (shape: { points: Point[] }, point: Point) => void
	}
}

export const createDrawingStore = (
	config: FullEchoOptions,
	currentPageKey: string,
	onStateChange?: (state: Partial<DrawingState>, isClearing?: boolean) => void,
): DrawingStore => {
	const [state, setState] = createStore<DrawingState>({
		isDrawing: false,
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

	const wrappedSetState = (newState: Partial<DrawingState>, isClearing = false) => {
		if (newState.selectedTool || newState.selectedColor) {
			const tool = newState.selectedTool || state.selectedTool
			const color = newState.selectedColor || state.selectedColor
			newState.cursor = computeCursor(tool, color)
		}
		setState(newState)
		onStateChange?.(newState, isClearing)
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
			// wrappedSetState({
			// 	selectedShapeId: state.selectedShapeId === shapeId ? null : shapeId,
			// })
		},
		handleStart: (e: MouseEvent | TouchEvent) => {
			if (e instanceof MouseEvent) {
				const target = e.target as HTMLElement
				if (!target.classList.contains('echo-drawing-layer-mask') && !target.classList.contains('echo-shape')) {
					return
				}
			}

			const point = getPointFromEvent(e)

			if (e.target instanceof SVGElement && e.target.classList.contains('echo-shape')) {
				const shapeId = e.target.dataset.shapeId
				if (shapeId && state.selectedShapeId === shapeId) {
					const shape = state.shapes.find(s => s.id === shapeId)
					if (shape) {
						methods.startDrag(point)
						methods.updateDragOffset(shape, point)
						return
					}
				}
			}

			methods.setInitialClick(point)
		},
		handleMove: (e: MouseEvent | TouchEvent) => {
			const clientPoint = getPointFromEvent(e, { useClientCoords: true })
			const point = getPointFromEvent(e)

			wrappedSetState({ mousePosition: clientPoint })

			if (state.isDragging && state.selectedShapeId && state.dragStartPos) {
				const shape = state.shapes.find(s => s.id === state.selectedShapeId)
				if (shape) {
					const dx = point.x - state.dragStartPos.x
					const dy = point.y - state.dragStartPos.y

					const updatedShapes = state.shapes.map(s => {
						if (s.id === state.selectedShapeId) {
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

					wrappedSetState({ shapes: updatedShapes })
					methods.startDrag(point)
					return
				}
			}

			if (state.initialClickPos && !state.isDrawing) {
				const distance = getDistance(state.initialClickPos, point)
				if (distance >= MOVEMENT_THRESHOLD) {
					methods.startDrawing(state.initialClickPos)
				}
				return
			}

			if (state.isDrawing) {
				methods.updateDrawing(point)
			}
		},
		handleEnd: (e: MouseEvent | TouchEvent) => {
			if (state.isDragging) {
				methods.stopDrag()
				return
			}

			if (state.initialClickPos && !state.isDrawing) {
				const point = getPointFromEvent(e)
				const distance = getDistance(state.initialClickPos, point)
				if (distance < MOVEMENT_THRESHOLD && e.target instanceof SVGElement && e.target.classList.contains('echo-shape')) {
					const shapeId = e.target.dataset.shapeId
					if (shapeId) {
						wrappedSetState({ selectedShapeId: shapeId })
					}
				}
			}

			methods.setInitialClick(null)
			methods.finishDrawing()
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
