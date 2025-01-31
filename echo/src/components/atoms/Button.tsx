import type { Component, JSX } from 'solid-js'

type ButtonProps = JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
	variant?: 'primary' | 'secondary'
	size?: 'xs' | 'sm' | 'md' | 'lg'
}

export const Button: Component<ButtonProps> = props => {
	const variant = () => props.variant || 'primary'
	const size = () => props.size || 'md'

	return <button {...props} class={`echo-button echo-button-${variant()} echo-button-${size()} ${props.class}`} />
}
