import { Component } from 'solid-js'
import { IconProps } from '~/types'

export const CloseIcon: Component<IconProps> = props => (
	<svg
		width={props.size ?? 24}
		height={props.size ?? 24}
		viewBox="0 0 24 24"
		fill="none"
		stroke={props.stroke ?? 'currentColor'}
		stroke-width={props.strokeWidth ?? 2}
		stroke-linecap="round"
		stroke-linejoin="round"
		class={props.class}
		style={props.style}
	>
		<line x1="18" y1="6" x2="6" y2="18" />
		<line x1="6" y1="6" x2="18" y2="18" />
	</svg>
)
