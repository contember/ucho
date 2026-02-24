import type { Component } from 'solid-js'
import type { IconProps } from '~/types'

export const ContemberIcon: Component<IconProps> = props => {
	return (
		<svg width={props.size ?? 24} height={props.size ?? 24} viewBox="0 0 64 66" fill="none" class={props.class} style={props.style}>
			<path
				d="M59.716 36.936L54.9 33l-6.17 5.108a77.278 77.278 0 00-12.744 13.469l-3.637 4.914-3.778-5.017a83.719 83.719 0 00-13.956-14.538L9.799 33l2.86-2.332A104.39 104.39 0 0030.1 12.5l2.24-2.98 1.736 2.298a111.905 111.905 0 0018.608 19.384l2.206 1.81 2.861-2.333a104.13 104.13 0 005.297-4.641C59.978 11.294 47.409.26 32.349.26 14.997.26.92 14.923.92 33c0 18.076 14.077 32.74 31.43 32.74 15.102 0 27.715-11.103 30.73-25.892a75.808 75.808 0 00-3.375-2.912h.011z"
				fill={props.fill ?? 'currentColor'}
			/>
		</svg>
	)
}
