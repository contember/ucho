import { config } from '../config'
import { Shape } from '../types'
import { getRectFromPoints } from './geometry'

export const renderShape = (
	shape: Shape,
	selectedShapeId: () => string | null,
	handleShapeClick: ((id: string) => void) | null,
	isMask?: boolean,
) => {
	const isSelected = shape.id === selectedShapeId()
	const tool = shape.type === 'path' ? config.pen : config.highlight
	const strokeWidth = isSelected ? tool.strokeWidth.selected : tool.strokeWidth.normal

	if (shape.type === 'rectangle' && shape.points.length === 2) {
		const rect = getRectFromPoints(shape.points)
		if (!rect) return null
		return (
			<rect
				x={rect.x}
				y={rect.y}
				width={rect.width}
				height={rect.height}
				fill={isMask ? 'black' : 'none'}
				stroke={isMask ? 'none' : shape.color}
				stroke-width={isMask ? 0 : strokeWidth}
				stroke-dasharray={isSelected ? '5,5' : 'none'}
				onClick={isMask ? undefined : () => handleShapeClick?.(shape.id)}
				style={isMask ? undefined : handleShapeClick !== null ? { cursor: 'pointer' } : undefined}
			/>
		)
	}
	if (shape.type === 'path') {
		if (isMask) return null

		const pathData = `M ${shape.points[0].x} ${shape.points[0].y} ${shape.points
			.slice(1)
			.map(point => `L ${point.x} ${point.y}`)
			.join(' ')}`
		return (
			<path
				d={pathData}
				fill="none"
				stroke={shape.color}
				stroke-width={strokeWidth}
				stroke-linecap="round"
				stroke-dasharray={isSelected ? '5,5' : 'none'}
				onClick={() => handleShapeClick?.(shape.id)}
				style={isMask ? undefined : handleShapeClick !== null ? { cursor: 'pointer', opacity: tool.opacity.normal } : undefined}
			/>
		)
	}
	return null
}
