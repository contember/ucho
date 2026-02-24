import type { Component } from 'solid-js'
import type { IconProps } from '~/types'

export const PenIcon: Component<IconProps> = props => (
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
		<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
	</svg>
)
