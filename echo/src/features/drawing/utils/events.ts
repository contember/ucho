import { Point } from '~/types'

export const getPointFromEvent = (e: MouseEvent | TouchEvent): Point => {
	const touch = e instanceof TouchEvent ? e.touches[0] : null
	return {
		x: touch ? touch.clientX : (e as MouseEvent).clientX,
		y: touch ? touch.clientY : (e as MouseEvent).clientY,
	}
}

export const getDistance = (p1: Point, p2: Point): number => {
	const dx = p2.x - p1.x
	const dy = p2.y - p1.y
	return Math.sqrt(dx * dx + dy * dy)
}
