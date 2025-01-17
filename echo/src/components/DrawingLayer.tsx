import { Component, For, onCleanup, onMount } from 'solid-js'
import { useDrawing } from '../contexts/DrawingContext'
import { useWidget } from '../contexts/WidgetContext'
import { renderShape } from '../utils/shape'

export const DrawingLayer: Component = () => {
	const { primaryColor, isOverlayVisible, isOpen } = useWidget()
	const {
		state: { currentPoints, shapes, currentPath, selectedShapeId },
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
				'pointer-events': 'none',
			}}
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
				fill="rgba(0, 0, 0, 0.2)"
				style={{
					transition: 'opacity 0.3s ease-in-out',
					opacity: isOverlayVisible() ? 1 : 0,
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

			{currentPath() && <path d={currentPath()} fill="none" stroke={primaryColor} stroke-width="3" stroke-linecap="round" />}
		</svg>
	)
}
