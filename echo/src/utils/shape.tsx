import { Shape } from '../types'
import { getRectFromPoints } from './geometry'

export const renderShape = (shape: Shape, selectedShapeId: () => string | null, handleShapeClick: (id: string) => void, isMask?: boolean) => {
	const isSelected = shape.id === selectedShapeId()
	const strokeWidth = isSelected ? 3 : 2
	const strokeDasharray = isSelected ? '5,5' : 'none'

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
				stroke-dasharray={isMask ? 'none' : strokeDasharray}
				onClick={isMask ? undefined : () => handleShapeClick(shape.id)}
				style={isMask ? undefined : { cursor: 'pointer' }}
			/>
		)
	}
	if (shape.type === 'path') {
		const pathData = `M ${shape.points[0].x} ${shape.points[0].y} ${shape.points
			.slice(1)
			.map(point => `L ${point.x} ${point.y}`)
			.join(' ')}`
		return (
			<path
				d={pathData}
				fill="none"
				stroke={isMask ? 'black' : shape.color}
				stroke-width={isMask ? strokeWidth * 1.5 : strokeWidth}
				stroke-linecap="round"
				stroke-dasharray={isMask ? 'none' : strokeDasharray}
				onClick={isMask ? undefined : () => handleShapeClick(shape.id)}
				style={isMask ? undefined : { cursor: 'pointer', opacity: '1' }}
			/>
		)
	}
	return null
}
