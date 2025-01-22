import { Component, Show, createMemo } from 'solid-js'
import { useRootStore } from '../contexts/RootContext'
import { getRectFromPoints } from '../utils/geometry'
import { TrashIcon } from './icons/TrashIcon'

export const ShapeActions: Component = () => {
	const store = useRootStore()

	const handleDelete = () => {
		if (store.drawing.selectedShapeId) {
			store.setDrawing({
				shapes: store.drawing.shapes.filter(shape => shape.id !== store.drawing.selectedShapeId),
				selectedShapeId: null,
			})
		}
	}

	const selectedShape = createMemo(() => {
		if (!store.drawing.selectedShapeId) return null
		return store.drawing.shapes.find(shape => shape.id === store.drawing.selectedShapeId)
	})

	const position = createMemo(() => {
		const shape = selectedShape()
		if (!shape) return null

		if (shape.type === 'rectangle') {
			const rect = getRectFromPoints(shape.points)
			if (!rect) return null
			return {
				x: rect.x + rect.width / 2,
				y: rect.y,
			}
		}

		if (shape.type === 'path' && shape.points.length > 0) {
			// For path shapes, use the first point
			return {
				x: shape.points[0].x,
				y: shape.points[0].y,
			}
		}
		return null
	})

	return (
		<Show when={store.drawing.selectedShapeId && position()}>
			<div
				class="echo-shape-actions"
				style={{
					left: `${position()?.x}px`,
					top: `${position()?.y}px`,
				}}
			>
				<button onClick={handleDelete} class="echo-shape-action-button" title="Delete shape">
					<TrashIcon size={16} />
				</button>
			</div>
		</Show>
	)
}
