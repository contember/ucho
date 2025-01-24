import { drawingConfig } from '~/config/drawingConfig'
import { Shape } from '~/types'
import { getRectFromPoints } from '~/utils/geometry'

export const renderShape = (shape: Shape, isMask?: boolean) => {
	const tool = shape.type === 'path' ? drawingConfig.pen : drawingConfig.highlight
	const strokeWidth = tool.strokeWidth.active

	if (shape.type === 'rectangle' && shape.points.length === 2) {
		const rect = getRectFromPoints(shape.points)
		if (!rect) return null
		return (
			<rect
				x={rect.x}
				y={rect.y}
				width={rect.width}
				height={rect.height}
				fill={isMask ? 'black' : 'transparent'}
				stroke={isMask ? 'none' : shape.color}
				stroke-width={strokeWidth}
				vector-effect="non-scaling-stroke"
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
				vector-effect="non-scaling-stroke"
				stroke-linecap="round"
				style={isMask ? undefined : { opacity: tool.opacity.active }}
			/>
		)
	}
	return null
}
