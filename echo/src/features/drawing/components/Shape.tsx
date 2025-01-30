import type { Component } from 'solid-js'
import { drawingConfig } from '~/config/drawingConfig'
import type { Shape as ShapeType } from '~/types'
import { getRectFromPoints } from '~/utils/geometry'

interface ShapeProps {
	shape: ShapeType
	selectedShapeId: string | null
	onShapeClick?: (id: string) => void
	isMask?: boolean
}

export const Shape: Component<ShapeProps> = props => {
	const isSelected = () => props.shape.id === props.selectedShapeId
	const tool = () => (props.shape.type === 'path' ? drawingConfig.pen : drawingConfig.highlight)
	const strokeWidth = () => (isSelected() ? tool().strokeWidth.selected : tool().strokeWidth.normal)

	if (props.shape.type === 'rectangle' && props.shape.points.length === 2) {
		const rect = getRectFromPoints(props.shape.points)
		if (!rect) return null
		return (
			<g>
				<rect
					x={rect.x}
					y={rect.y}
					width={rect.width}
					height={rect.height}
					fill={props.isMask ? 'black' : 'transparent'}
					stroke={props.isMask ? 'none' : props.shape.color}
					stroke-width={strokeWidth()}
					vector-effect="non-scaling-stroke"
					stroke-dasharray={isSelected() ? '5,5' : 'none'}
					// onClick={props.isMask ? undefined : () => props.onShapeClick?.(props.shape.id)}
					onDblClick={(e: MouseEvent) => e.preventDefault()}
					class="echo-shape"
					data-shape-id={props.shape.id}
					style={{
						cursor: props.isMask ? undefined : isSelected() ? 'move' : 'pointer',
					}}
				/>
				{isSelected() && !props.isMask && (
					<rect
						x={rect.x - strokeWidth() / 2}
						y={rect.y - strokeWidth() / 2}
						width={rect.width + strokeWidth()}
						height={rect.height + strokeWidth()}
						fill="none"
						stroke={props.shape.color}
						stroke-width={strokeWidth()}
						vector-effect="non-scaling-stroke"
						stroke-dasharray="5,5"
						pointer-events="none"
						style={{ opacity: 0.3 }}
					/>
				)}
			</g>
		)
	}

	if (props.shape.type === 'path') {
		if (props.isMask) return null

		const pathData = `M ${props.shape.points[0].x} ${props.shape.points[0].y} ${props.shape.points.slice(1).map(point => `L ${point.x} ${point.y}`).join(' ')}`
		return (
			<path
				d={pathData}
				fill="none"
				stroke={props.shape.color}
				stroke-width={strokeWidth()}
				vector-effect="non-scaling-stroke"
				stroke-linecap="round"
				stroke-dasharray={isSelected() ? '5,5' : 'none'}
				// onClick={() => props.onShapeClick?.(props.shape.id)}
				onDblClick={(e: MouseEvent) => e.preventDefault()}
				class="echo-shape"
				data-shape-id={props.shape.id}
				style={
					props.isMask
						? undefined
						: props.onShapeClick !== null
							? {
								cursor: isSelected() ? 'move' : 'pointer',
								opacity: tool().opacity.normal,
							}
							: undefined
				}
			/>
		)
	}

	return null
}
