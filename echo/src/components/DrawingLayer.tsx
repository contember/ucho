import { Component, For, onCleanup, onMount } from 'solid-js'
import { useDrawing } from '../contexts/DrawingContext'
import { useWidget } from '../contexts/WidgetContext'

export const DrawingLayer: Component = () => {
	const { primaryColor } = useWidget()
	const {
		state: { startPoint, endPoint, paths, currentPath },
		handlers: { handleMouseMove, handleMouseUp },
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
					{startPoint() && endPoint() && (
						<rect
							x={Math.min(startPoint()!.x, endPoint()!.x)}
							y={Math.min(startPoint()!.y, endPoint()!.y)}
							width={Math.abs(endPoint()!.x - startPoint()!.x)}
							height={Math.abs(endPoint()!.y - startPoint()!.y)}
							fill="black"
						/>
					)}
				</mask>
			</defs>

			<rect width="100%" height="100%" fill="rgba(0, 0, 0, 0.2)" mask="url(#selection-mask)" />

			{startPoint() && endPoint() && (
				<rect
					x={Math.min(startPoint()!.x, endPoint()!.x)}
					y={Math.min(startPoint()!.y, endPoint()!.y)}
					width={Math.abs(endPoint()!.x - startPoint()!.x)}
					height={Math.abs(endPoint()!.y - startPoint()!.y)}
					fill="none"
					stroke={primaryColor}
					stroke-width="2"
				/>
			)}

			<For each={paths()}>{pathData => <path d={pathData} fill="none" stroke={primaryColor} stroke-width="3" stroke-linecap="round" />}</For>

			{currentPath() && <path d={currentPath()} fill="none" stroke={primaryColor} stroke-width="3" stroke-linecap="round" />}
		</svg>
	)
}
