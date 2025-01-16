import { Component } from 'solid-js'
import { IconProps } from '../../types'

export const MessageIcon: Component<IconProps> = props => (
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
		<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke-dasharray="3,3" />
		<path d="M8 8h8" />
		<path d="M8 12h6" />
	</svg>
)
