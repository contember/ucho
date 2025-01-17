import { Component } from 'solid-js'
import { IconProps } from '../../types'

export const ChevronRightIcon: Component<IconProps> = props => {
	return (
		<svg
			width={props.size ?? 24}
			height={props.size ?? 24}
			viewBox="0 0 24 24"
			fill="none"
			stroke={props.stroke ?? 'currentColor'}
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			style={{
				transform: 'rotate(90deg)',
				...props.style,
			}}
		>
			<polyline points="18 15 12 9 6 15" />
		</svg>
	)
}
