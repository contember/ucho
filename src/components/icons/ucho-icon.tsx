import type { Component } from 'solid-js'
import type { IconProps } from '~/types'

export const UchoIcon: Component<IconProps> = props => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={props.size ?? 52}
		height={props.size ?? 52}
		viewBox="-24 -24 304 304"
		class={props.class}
		style={props.style}
	>
		<defs>
			<filter id="ucho-shadow" x="-20%" y="-20%" width="140%" height="140%">
				<feDropShadow dx="0" dy="2" stdDeviation="6" flood-opacity="0.25" />
			</filter>
		</defs>
		<circle cx="128" cy="128" r="128" fill="black" filter="url(#ucho-shadow)" />
		<g transform="translate(128,128) scale(0.75) translate(-128,-128)">
			<path d="M160,216c-8.07,9.77-18.34,16-32,16a44,44,0,0,1-44-44c0-41.49-36-28-36-84a80,80,0,0,1,160,0" fill="none" stroke={props.stroke ?? 'white'} stroke-linecap="round" stroke-linejoin="round" stroke-width="18" />
			<path d="M173.86,168A16,16,0,0,1,144,160c0-24,24-32,24-56a40,40,0,0,0-80,0" fill="none" stroke={props.stroke ?? 'white'} stroke-linecap="round" stroke-linejoin="round" stroke-width="18" />
		</g>
	</svg>
)
