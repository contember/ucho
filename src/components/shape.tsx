import { Component, createMemo, For, Show } from 'solid-js'
import { toolConfig } from '~/config/drawing-config'
import type { Point, Shape as ShapeType } from '~/types'
import { getPathFromPoints, getRectFromPoints } from '~/utils/geometry'

type ShapeProps = ShapeType & {
	selectedShapeId: string | null
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

const ResizeHandles: Component<{ points: Point[]; color: string }> = props => {
	const rect = createMemo(() => getRectFromPoints(props.points))
	const corners = createMemo(() => {
		const r = rect()
		if (!r) return []
		const { x, y, width, height } = r
		return [
			{ cx: x, cy: y, anchorX: x + width, anchorY: y + height, cursor: 'nwse-resize' },
			{ cx: x + width, cy: y, anchorX: x, anchorY: y + height, cursor: 'nesw-resize' },
			{ cx: x, cy: y + height, anchorX: x + width, anchorY: y, cursor: 'nesw-resize' },
			{ cx: x + width, cy: y + height, anchorX: x, anchorY: y, cursor: 'nwse-resize' },
		]
	})

	return (
		<For each={corners()}>
			{corner => (
				<circle
					class="ucho-resize-handle"
					cx={corner.cx}
					cy={corner.cy}
					r={5}
					fill="white"
					stroke={props.color}
					stroke-width={1.5}
					cursor={corner.cursor}
					data-anchor-x={corner.anchorX}
					data-anchor-y={corner.anchorY}
				/>
			)}
		</For>
	)
}

const RectangleShape: Component<ShapeProps & { isSelected: boolean }> = props => {
	const rect = createMemo(() => getRectFromPoints(props.points))
	return (
		<Show when={rect()}>
			<rect
				class="ucho-shape"
				data-shape-id={props.id}
				data-selected={props.isSelected}
				x={rect()!.x}
				y={rect()!.y}
				width={rect()!.width}
				height={rect()!.height}
				fill="transparent"
				stroke={props.color}
				stroke-width={toolConfig.rectangle.strokeWidth}
				opacity={props.isSelected ? toolConfig.rectangle.opacity.selected : toolConfig.rectangle.opacity.default}
				vector-effect="non-scaling-stroke"
				stroke-dasharray={props.isSelected ? '5,5' : 'none'}
				cursor={props.isSelected ? 'move' : 'grab'}
				role="img"
				aria-label={`Rectangle shape ${props.isSelected ? '(selected)' : ''}`}
			/>
			<Show when={props.isSelected}>
				<ResizeHandles points={props.points} color={props.color} />
			</Show>
		</Show>
	)
}

const PathShape: Component<ShapeProps & { isSelected: boolean }> = props => {
	const path = createMemo(() => getPathFromPoints(props.points))
	return (
		<Show when={path()}>
			<path
				class="ucho-shape"
				data-shape-id={props.id}
				data-selected={props.isSelected}
				d={path()!}
				fill="none"
				stroke={props.color}
				stroke-width={toolConfig.path.strokeWidth}
				vector-effect="non-scaling-stroke"
				stroke-linecap="round"
				opacity={props.isSelected ? toolConfig.path.opacity.selected : toolConfig.path.opacity.default}
				cursor={props.isSelected ? 'move' : 'grab'}
				role="img"
				aria-label={`Freehand shape ${props.isSelected ? '(selected)' : ''}`}
			/>
		</Show>
	)
}
