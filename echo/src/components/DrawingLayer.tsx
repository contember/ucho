import { Component, For, createSignal, onCleanup, onMount } from 'solid-js'
import { config } from '../config'
import { useDrawing } from '../contexts/DrawingContext'
import { useWidget } from '../contexts/WidgetContext'
import { renderShape } from '../utils/shape'

export const DrawingLayer: Component = () => {
	const { primaryColor, isOpenStaggered } = useWidget()
	const {
		state: { currentPoints, shapes, currentPath, selectedShapeId, selectedTool, isDrawing },
		handlers: { handleMouseMove, handleMouseUp, handleShapeClick },
	} = useDrawing()

	const [viewportWidth, setViewportWidth] = createSignal(window.innerWidth)
	const [viewportHeight, setViewportHeight] = createSignal(window.innerHeight)

	const handleResize = () => {
		setViewportWidth(window.innerWidth)
		setViewportHeight(window.innerHeight)
	}

	onMount(() => {
		document.addEventListener('mousemove', handleMouseMove)
		document.addEventListener('mouseup', handleMouseUp)
		window.addEventListener('resize', handleResize)
	})

	onCleanup(() => {
		document.removeEventListener('mousemove', handleMouseMove)
		document.removeEventListener('mouseup', handleMouseUp)
		window.removeEventListener('resize', handleResize)
	})

	const generateCutoutPath = () => {
		// Outer rectangle (clockwise)
		let path = `M0 0 H${viewportWidth()} V${viewportHeight()} H0 Z`

		// Add cutouts for current drawing (counter-clockwise)
		if (currentPoints().length === 2) {
			const [start, end] = currentPoints()
			path += ` M${start.x} ${start.y} h${end.x - start.x} v${end.y - start.y} h${start.x - end.x} v${start.y - end.y}`
		}

		// Add cutouts for existing shapes (counter-clockwise)
		for (const shape of shapes()) {
			if (shape.type === 'rectangle') {
				const [start, end] = shape.points
				path += ` M${start.x} ${start.y} h${end.x - start.x} v${end.y - start.y} h${start.x - end.x} v${start.y - end.y}`
			}
		}

		return path
	}

	return (
		<>
			{/* Highlight layer */}
			<div style={{ position: 'absolute', inset: 0, 'pointer-events': 'none' }}>
				<svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }} viewBox={`0 0 ${viewportWidth()} ${viewportHeight()}`}>
					<path
						d={generateCutoutPath()}
						fill="rgba(33, 43, 55, 1)"
						fill-opacity="0.2"
						fill-rule="evenodd"
						style={{
							transition: 'opacity 0.3s ease-in-out',
							opacity: isOpenStaggered() ? 1 : 0,
						}}
					/>
				</svg>
			</div>

			{/* Drawing layer for actual shapes */}
			<svg width="100%" height="100%" class="echo-drawing-layer" preserveAspectRatio="none">
				<For each={shapes()}>{shape => renderShape(shape, selectedShapeId, handleShapeClick, false)}</For>

				{currentPoints().length === 2 &&
					renderShape(
						{
							id: 'temp',
							type: 'rectangle',
							color: primaryColor,
							points: currentPoints(),
						},
						selectedShapeId,
						handleShapeClick,
						false,
					)}

				{currentPath() && selectedTool() === 'pen' && (
					<path
						d={currentPath()}
						fill="none"
						stroke={primaryColor}
						stroke-width={config.pen.strokeWidth.active}
						stroke-linecap="round"
						style={{ opacity: isDrawing() ? config.pen.opacity.active : config.pen.opacity.normal }}
					/>
				)}
			</svg>
		</>
	)
}
