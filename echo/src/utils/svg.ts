export const generateCutoutPath = (
	dimensions: {
		width: number
		height: number
	},
	currentPoints: { x: number; y: number }[],
	shapes: { type: string; points: { x: number; y: number }[] }[],
) => {
	let path = `M0 0 H${dimensions.width} V${dimensions.height} H0 Z`

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
