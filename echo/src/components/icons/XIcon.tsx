import { Component } from 'solid-js'
import { IconProps } from '~/types'

export const XIcon: Component<IconProps> = props => (
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
		<path d="M18 6 6 18" />
		<path d="m6 6 12 12" />
	</svg>
)
