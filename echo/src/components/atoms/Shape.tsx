import { Component, Show, createMemo } from 'solid-js'
import { toolConfig } from '~/config/drawingConfig'
import type { Shape as ShapeType } from '~/types'
import { getPathFromPoints, getRectFromPoints } from '~/utils/geometry'

type ShapeProps = ShapeType & {
	selectedShapeId: string | null
	onShapeClick?: (id: string) => void
}

export const Shape: Component<ShapeProps> = props => {
	const isSelected = createMemo(() => props.id === props.selectedShapeId)

	return (
		<>
			<Show when={props.type === 'rectangle'}>
				<RectangleShape {...props} isSelected={isSelected()} />
			</Show>

			<Show when={props.type === 'path'}>
				<PathShape {...props} isSelected={isSelected()} />
			</Show>
		</>
	)
}

const RectangleShape: Component<ShapeProps & { isSelected: boolean }> = props => {
	const rect = createMemo(() => getRectFromPoints(props.points))
	return (
		<Show when={rect()}>
			<rect
				class="echo-shape"
				data-shape-id={props.id}
				data-selected={props.isSelected}
				x={rect()!.x}
				y={rect()!.y}
				width={rect()!.width}
				height={rect()!.height}
				fill="transparent"
				stroke={props.color}
				stroke-width={toolConfig.rectangle.strokeWidth.active}
				vector-effect="non-scaling-stroke"
				stroke-dasharray={props.isSelected ? '5,5' : 'none'}
				cursor={props.isSelected ? 'move' : 'pointer'}
				onClick={() => props.onShapeClick?.(props.id)}
			/>
		</Show>
	)
}

const PathShape: Component<ShapeProps & { isSelected: boolean }> = props => {
	const path = createMemo(() => getPathFromPoints(props.points))
	return (
		<Show when={path()}>
			<path
				class="echo-shape"
				data-shape-id={props.id}
				data-selected={props.isSelected}
				d={path()!}
				fill="none"
				stroke={props.color}
				stroke-width={toolConfig.path.strokeWidth.active}
				vector-effect="non-scaling-stroke"
				stroke-linecap="round"
				opacity={props.isSelected ? 0.6 : 1}
				cursor={props.isSelected ? 'move' : 'pointer'}
				onClick={() => props.onShapeClick?.(props.id)}
			/>
		</Show>
	)
}
