import { Component, For, onCleanup, onMount } from 'solid-js'
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

	onMount(() => {
		document.addEventListener('mousemove', handleMouseMove)
		document.addEventListener('mouseup', handleMouseUp)
	})

	onCleanup(() => {
		document.removeEventListener('mousemove', handleMouseMove)
		document.removeEventListener('mouseup', handleMouseUp)
	})

	return (
		<svg
			width="100%"
			height="100%"
			style={{
				position: 'absolute',
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				'pointer-events': 'none',
				'transform-origin': '0 0',
			}}
			preserveAspectRatio="none"
		>
			<defs>
				<mask id="selection-mask">
					<rect width="100%" height="100%" fill="white" />
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
							true,
						)}
					<For each={shapes()}>{shape => renderShape(shape, selectedShapeId, handleShapeClick, true)}</For>
				</mask>
			</defs>

			<rect
				width="100%"
				height="100%"
				fill={config.overlay.maskBackground}
				style={{
					transition: 'opacity 0.3s ease-in-out',
					opacity: isOpenStaggered() ? config.overlay.maskOpacity : 0,
				}}
				mask="url(#selection-mask)"
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
					handleShapeClick,
					false,
				)}

			{currentPath() && selectedTool() === 'pen' && (
				<path
					d={currentPath()}
					fill="none"
					stroke={primaryColor}
					stroke-width={config.tools.pen.strokeWidth.active}
					stroke-linecap="round"
					style={{ opacity: isDrawing() ? config.tools.pen.opacity.active : config.tools.pen.opacity.normal }}
				/>
			)}
		</svg>
	)
}
