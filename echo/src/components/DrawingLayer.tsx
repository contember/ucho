import { Component, For, createSignal, onCleanup, onMount } from 'solid-js'
import { config } from '../config'
import { useDrawing } from '../contexts/DrawingContext'
import { useWidget } from '../contexts/WidgetContext'
import { renderShape } from '../utils/shape'
import { DrawingTooltip } from './DrawingTooltip'

export const DrawingLayer: Component = () => {
	const { primaryColor, isOpenStaggered } = useWidget()
	const {
		state: { currentPoints, shapes, currentPath, selectedShapeId, selectedTool, isDrawing, setShowTooltip, setMousePosition, setHasDrawn, hasDrawn },
		handlers: { handleMouseMove, handleMouseUp, handleShapeClick, handleMouseDown },
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
		let path = `M0 0 H${viewportWidth()} V${viewportHeight()} H0 Z`

		if (currentPoints().length === 2) {
			const [start, end] = currentPoints()
			path += ` M${start.x} ${start.y} h${end.x - start.x} v${end.y - start.y} h${start.x - end.x} v${start.y - end.y}`
		}

		for (const shape of shapes()) {
			if (shape.type === 'rectangle') {
				const [start, end] = shape.points
				path += ` M${start.x} ${start.y} h${end.x - start.x} v${end.y - start.y} h${start.x - end.x} v${start.y - end.y}`
			}
		}

		return path
	}

	const handleMouseMoveWithTooltip = (e: MouseEvent) => {
		handleMouseMove(e)
		setMousePosition({ x: e.clientX, y: e.clientY })
	}

	const handleMouseEnter = (e: MouseEvent) => {
		if (e.target === e.currentTarget && !hasDrawn()) {
			setShowTooltip(true)
		}
	}

	const handleMouseLeave = (e: MouseEvent) => {
		if (e.target === e.currentTarget) {
			setShowTooltip(false)
		}
	}

	const penCursor = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="${primaryColor.replace('#', '%23')}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="24" cy="24" r="8"/></svg>`

	const getCursor = () => {
		const tool = config[selectedTool()]
		if (tool.id === 'pen') {
			return `url('${penCursor}') 24 24, auto`
		}
		return tool.cursor
	}

	return (
		<div
			class="echo-drawing-layer-container"
			style={{
				cursor: getCursor(),
			}}
		>
			<DrawingTooltip />
			<svg
				width="100%"
				height="100%"
				class="echo-drawing-layer"
				preserveAspectRatio="none"
				onMouseDown={e => {
					handleMouseDown(e)
					setShowTooltip(false)
					setHasDrawn(true)
				}}
				onMouseMove={handleMouseMoveWithTooltip}
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
			>
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
						null,
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
		</div>
	)
}
