import type { Point } from '~/types'

export const getPointFromEvent = (e: MouseEvent | TouchEvent, { useClientCoords = false }: { useClientCoords?: boolean } = {}): Point => {
	const isTouchEvent = typeof TouchEvent !== 'undefined' && e instanceof TouchEvent
	const touch = isTouchEvent ? (e.touches[0] ?? e.changedTouches[0] ?? null) : null
	if (touch) {
		return {
			x: useClientCoords ? touch.clientX : touch.pageX,
			y: useClientCoords ? touch.clientY : touch.pageY,
		}
	}
	const mouse = e as MouseEvent
	return {
		x: useClientCoords ? mouse.clientX : mouse.pageX,
		y: useClientCoords ? mouse.clientY : mouse.pageY,
	}
}

export const getDistance = (p1: Point, p2: Point): number => {
	const dx = p2.x - p1.x
	const dy = p2.y - p1.y
	return Math.sqrt(dx * dx + dy * dy)
}
