import type { Component } from 'solid-js'
import type { IconProps } from '~/types'

export const MessageIcon: Component<IconProps> = props => (
	// <svg
	// 	xmlns="http://www.w3.org/2000/svg"
	// 	width={props.size ?? 24}
	// 	height={props.size ?? 24}
	// 	viewBox="0 0 24 24"
	// 	fill={props.fill ?? 'none'}
	// 	stroke={props.stroke ?? 'currentColor'}
	// 	stroke-width={props.strokeWidth ?? 2}
	// 	stroke-linecap="round"
	// 	stroke-linejoin="round"
	// 	class={props.class}
	// 	style={props.style}
	// >
	// 	<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
	// 	<path d="M8 8h8" />
	// 	<path d="M8 12h6" />
	// </svg>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		stroke="white"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
		class="lucide lucide-square-mouse-pointer"
	>
		<path d="M12.034 12.681a.498.498 0 0 1 .647-.647l9 3.5a.5.5 0 0 1-.033.943l-3.444 1.068a1 1 0 0 0-.66.66l-1.067 3.443a.5.5 0 0 1-.943.033z" />
		<path d="M21 11V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6" />
	</svg>
)
