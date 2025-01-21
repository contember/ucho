import { Component } from 'solid-js'
import { useDrawing } from '../contexts/DrawingContext'
import { useWidget } from '../contexts/WidgetContext'
import { CloseIcon } from './icons'
import { ContemberIcon } from './icons/ContemberIcon'

export const WidgetButton: Component = () => {
	const { isOpenStaggered, toggleWidget } = useWidget()
	const {
		state: { isDrawing },
	} = useDrawing()

	return (
		<button onClick={toggleWidget} class="echo-widget-button" data-hidden={isDrawing()}>
			<ContemberIcon
				stroke="white"
				fill="#ffffff"
				style={{
					transition: 'opacity 0.2s ease',
					opacity: isOpenStaggered() ? '0' : '1',
				}}
			/>
			<CloseIcon
				stroke="white"
				style={{
					transition: 'opacity 0.2s ease',
					opacity: isOpenStaggered() ? '1' : '0',
					position: 'absolute',
				}}
			/>
		</button>
	)
}
