import type { Component } from 'solid-js'
import type { IconProps } from '~/types'

export const SendIcon: Component<IconProps> = props => (
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
		<path d="M22 2 11 13" />
		<path d="M22 2 15 22l-4-9-9-4Z" />
	</svg>
)
