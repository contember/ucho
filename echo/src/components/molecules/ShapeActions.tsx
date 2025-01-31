import { type Component, createMemo, createSignal, onCleanup, onMount } from 'solid-js'
import { Button } from '~/components/atoms'
import { TrashIcon } from '~/components/icons'
import { useEchoStore } from '~/contexts'
import type { Point } from '~/types'
import { getRectFromPoints } from '~/utils/geometry'

export const ShapeActions: Component = () => {
	const store = useEchoStore()
	let actionsRef: HTMLDivElement | undefined
	const [scrollPosition, setScrollPosition] = createSignal({ x: window.scrollX, y: window.scrollY })

	onMount(() => {
		const handleScroll = () => {
			setScrollPosition({ x: window.scrollX, y: window.scrollY })
		}
		window.addEventListener('scroll', handleScroll)
		onCleanup(() => window.removeEventListener('scroll', handleScroll))
	})

	const handleDelete = () => {
		if (store.drawing.state.selectedShapeId) {
			store.drawing.setState({
				shapes: store.drawing.state.shapes.filter(shape => shape.id !== store.drawing.state.selectedShapeId),
				selectedShapeId: null,
			})
		}
	}

	const selectedShape = createMemo(() => {
		if (!store.drawing.state.selectedShapeId) return null
		return store.drawing.state.shapes.find(shape => shape.id === store.drawing.state.selectedShapeId)
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

		const scroll = scrollPosition()
		return {
			x: Math.max(actionsRect.width / 2 + PADDING, Math.min(window.innerWidth - actionsRect.width / 2 - PADDING, point.x - scroll.x)),
			y: Math.max(actionsRect.height + PADDING, Math.min(window.innerHeight - PADDING, point.y - scroll.y)),
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
			<Button onClick={handleDelete} size="sm" variant="secondary" title="Delete shape">
				<TrashIcon size={20} />
			</Button>
		</div>
	)
}
