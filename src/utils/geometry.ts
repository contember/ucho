import type { Point } from '~/types'

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

export const getPathFromPoints = (points: Point[]) => {
	if (points.length < 2) return null
	let d = `M ${points[0].x} ${points[0].y}`
	for (let i = 1; i < points.length; i++) {
		d += ` L ${points[i].x} ${points[i].y}`
	}
	return d
}
