import { StylesConfig } from '../types'

export const colorSelectorStyles = (config: StylesConfig) => {
	const { primaryColor } = config
	const hoverColor = `color-mix(in srgb, ${primaryColor}, black 10%)`
	return `
	.echo-color-selector {
		position: relative;
	}

	.echo-color-selector:hover .echo-drawing-toolbar-button {
		border-top-right-radius: 0;
		border-bottom-right-radius: 0;
		transform: scale(1.05);
		border-right-color: transparent;
		background: color-mix(in srgb, ${primaryColor}, white 90%);
		border-color: ${hoverColor};
	}

	.echo-color-swatch-wrapper {
		position: absolute;
		left: calc(100% - 2px);
		top: 50%;
		transform: translateY(-50%);
		height: calc(50px * 1.05);
		padding-right: 8px;
		display: none;
	}

	.echo-color-selector:hover .echo-color-swatch-wrapper {
		display: block;
	}

	.echo-color-swatch {
		height: 100%;
		background: white;
		border-radius: 8px;
		border-top-left-radius: 0;
		border-bottom-left-radius: 0;
		padding: 8px;
		padding-left: 10px;
		box-shadow: 0 2px 4px rgba(0,0,0,0.1);
		display: flex;
		align-items: center;
		gap: 8px;
		border: 2px solid #ddd;
		border-left: none;
		box-sizing: border-box;
	}

	.echo-color-selector:hover .echo-color-swatch {
		border-color: ${hoverColor};
	}

	.echo-color-swatch-button {
		width: 24px;
		height: 24px;
		border-radius: 50%;
		border: 2px solid transparent;
		cursor: pointer;
		padding: 0;
		transition: transform 0.2s ease;
	}

	.echo-color-swatch-button:hover {
		transform: scale(1.1);
	}

	.echo-color-swatch-button[data-selected="true"] {
		border-color: ${primaryColor};
	}
`
}
