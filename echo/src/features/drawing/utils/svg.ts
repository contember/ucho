import { ViewportState } from '../types'

export const generateCutoutPath = (
	viewport: ViewportState,
	currentPoints: { x: number; y: number }[],
	shapes: { type: string; points: { x: number; y: number }[] }[],
) => {
	let path = `M0 0 H${viewport.width} V${viewport.height} H0 Z`

	if (currentPoints.length === 2) {
		const [start, end] = currentPoints
		path += ` M${start.x} ${start.y} h${end.x - start.x} v${end.y - start.y} h${start.x - end.x} v${start.y - end.y}`
	}

	for (const shape of shapes) {
		if (shape.type === 'rectangle') {
			const [start, end] = shape.points
			path += ` M${start.x} ${start.y} h${end.x - start.x} v${end.y - start.y} h${start.x - end.x} v${start.y - end.y}`
		}
	}

	return path
}

export const getPenCursor = (color: string) => {
	return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="${color.replace('#', '%23')}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="24" cy="24" r="8"/></svg>`
}
