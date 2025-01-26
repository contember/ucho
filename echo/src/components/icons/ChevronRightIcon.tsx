import { Component } from 'solid-js'
import { IconProps } from '~/types'

export const ChevronRightIcon: Component<IconProps> = props => (
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
		<path d="m9 18 6-6-6-6" />
	</svg>
)
