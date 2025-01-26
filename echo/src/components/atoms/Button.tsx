import { Component } from 'solid-js'
import { JSX } from 'solid-js'
import { EnrichedStylesConfig } from '~/types'

type ButtonProps = JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
	variant?: 'primary' | 'secondary'
	size?: 'xs' | 'sm' | 'md' | 'lg'
}

export const Button: Component<ButtonProps> = props => {
	const variant = () => props.variant || 'primary'
	const size = () => props.size || 'md'

	return <button {...props} class={`echo-button echo-button-${variant()} echo-button-${size()}`} />
}

export const buttonStyles = (config: EnrichedStylesConfig) => {
	const hoverColor = `color-mix(in srgb, ${config.primaryColor}, black 10%)`
	return `
		.echo-button {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			border: none;
			border-radius: 8px;
			font-weight: 500;
			cursor: pointer;
			transition: all 0.2s ease;
			line-height: 1;
		}

		.echo-button:focus-visible {
			outline: 2px solid ${config.primaryColor};
			outline-offset: 2px;
		}

		/* Variants */
		.echo-button-primary {
			background: ${config.primaryColor};
			color: white;
		}

		.echo-button-primary:hover {
			background: ${hoverColor};
			transform: translateY(-1px);
		}

		.echo-button-primary:active {
			transform: translateY(0);
		}

		.echo-button-secondary {
			background: transparent;
			color: #666;
		}

		.echo-button-secondary:hover {
			background-color: ${config.primaryColor}10;
			color: ${config.primaryColor};
		}

		/* Sizes */
		.echo-button-xs {
			padding: 4px;
			font-size: 12px;
		}

		.echo-button-sm {
			padding: 6px;
			font-size: 14px;
		}

		.echo-button-md {
			padding: 12px 24px;
			font-size: 0.9375rem;
		}

		.echo-button-lg {
			padding: 14px 28px;
			font-size: 1rem;
		}
	`
}
