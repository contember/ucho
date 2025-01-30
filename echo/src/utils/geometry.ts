import type  { Point } from '~/types'

export const getRectFromPoints = (points: Point[]) => {
	if (points.length !== 2) return null
	const [start, end] = points
	return {
		x: Math.min(start.x, end.x),
		y: Math.min(start.y, end.y),
		width: Math.abs(end.x - start.x),
		height: Math.abs(end.y - start.y),
	}
}
