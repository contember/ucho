import { Component, Show } from 'solid-js'
import { useRootStore } from '../contexts/RootContext'
import { CloseIcon } from './icons/CloseIcon'

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

	return (
		<Show when={store.drawing.selectedShapeId}>
			<div class="echo-shape-actions">
				<button onClick={handleDelete} class="echo-shape-action-button" title="Delete shape">
					<CloseIcon size={16} />
				</button>
			</div>
		</Show>
	)
}
