import type { Component } from 'solid-js'
import type { IconProps } from '~/types'

export const MinimizeIcon: Component<IconProps> = props => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={props.size ?? 24}
		height={props.size ?? 24}
		viewBox="0 0 24 24"
		fill={props.fill ?? 'none'}
		stroke={props.stroke ?? 'currentColor'}
		stroke-width={props.strokeWidth ?? 2}
		stroke-linecap="round"
		stroke-linejoin="round"
		class={props.class}
		style={props.style}
	>
		<polyline points="4 14 10 14 10 20" />
		<polyline points="20 10 14 10 14 4" />
		<line x1="14" x2="21" y1="10" y2="3" />
		<line x1="3" x2="10" y1="21" y2="14" />
	</svg>
)
