import type { Component } from 'solid-js'
import { drawingConfig } from '~/config/drawingConfig'
import type { Shape as ShapeType } from '~/types'
import { getPathFromPoints, getRectFromPoints } from '~/utils/geometry'

interface ShapeProps {
	shape: ShapeType
	selectedShapeId: string | null
	onShapeClick?: (id: string) => void
}

export const Shape: Component<ShapeProps> = props => {
	const isSelected = () => props.shape.id === props.selectedShapeId

	switch (props.shape.type) {
		case 'rectangle': {
			const rect = getRectFromPoints(props.shape.points)
			if (!rect) return null
			return (
				<rect
					x={rect.x}
					y={rect.y}
					width={rect.width}
					height={rect.height}
					fill={'transparent'}
					stroke={props.shape.color}
					stroke-width={drawingConfig.highlight.strokeWidth.active}
					vector-effect="non-scaling-stroke"
					stroke-dasharray={isSelected() ? '5,5' : 'none'}
					class="echo-shape"
					data-shape-id={props.shape.id}
					style={{
						cursor: isSelected() ? 'move' : 'pointer',
					}}
				/>
			)
		}
		case 'path': {
			const pathData = getPathFromPoints(props.shape.points)
			if (!pathData) return null
			return (
				<path
					d={pathData}
					fill="none"
					stroke={props.shape.color}
					stroke-width={drawingConfig.pen.strokeWidth.active}
					vector-effect="non-scaling-stroke"
					stroke-linecap="round"
					stroke-dasharray={isSelected() ? '5,5' : 'none'}
					class="echo-shape"
					data-shape-id={props.shape.id}
					style={{
						cursor: isSelected() ? 'move' : 'pointer',
						opacity: drawingConfig.highlight.opacity.normal,
					}}
				/>
			)
		}
		default:
			console.error(`Unknown shape type: ${props.shape.type}`)
			return null
	}
}
