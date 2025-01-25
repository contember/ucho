import { Component, createMemo } from 'solid-js'
import { TrashIcon } from '~/components/icons'
import { useEchoStore } from '~/contexts'
import { Point } from '~/types'
import { getRectFromPoints } from '~/utils/geometry'

export const ShapeActions: Component = () => {
	const store = useEchoStore()
	let actionsRef: HTMLDivElement | undefined

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
		const actionsRect = actionsRef?.getBoundingClientRect()

		if (!shape || !actionsRect) return null

		let point: Point | null = null

		if (shape.type === 'rectangle') {
			const rect = getRectFromPoints(shape.points)
			if (!rect) return null
			point = {
				x: rect.x + rect.width / 2,
				y: rect.y,
			}
		} else if (shape.type === 'path' && shape.points.length > 0) {
			point = {
				x: shape.points[0].x,
				y: shape.points[0].y,
			}
		} else {
			return null
		}

		const PADDING = 8

		// Ensure the position stays within viewport bounds
		return {
			x: Math.max(actionsRect.width / 2 + PADDING, Math.min(window.innerWidth - actionsRect.width / 2 - PADDING, point.x)),
			y: Math.max(actionsRect.height + PADDING, Math.min(window.innerHeight - PADDING, point.y)),
		}
	})

	return (
		<div
			ref={actionsRef}
			class="echo-shape-actions"
			data-hide-when-drawing="true"
			hidden={!position()}
			style={{
				left: position() ? `${position()?.x}px` : '0',
				top: position() ? `${position()?.y}px` : '0',
			}}
		>
			<button onClick={handleDelete} class="echo-shape-action-button" title="Delete shape">
				<TrashIcon size={16} />
			</button>
		</div>
	)
}
