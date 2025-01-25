import { zIndex } from '~/styles/zIndex'
import { StylesConfig } from '~/types'

export const drawingToolbarStyles = (config: StylesConfig) => {
	const { primaryColor } = config
	const hoverColor = `color-mix(in srgb, ${primaryColor}, black 10%)`
	return `
	.echo-drawing-toolbar {
		position: fixed;
		top: 20px;
		left: 20px;
		display: flex;
		flex-direction: column;
		gap: 10px;
		z-index: ${zIndex.drawingToolbar};
		opacity: 1;
		transition: opacity 0.2s ease-in-out;
		pointer-events: auto;
	}

	.echo-drawing-toolbar-button {
		width: 50px;
		height: 50px;
		border-radius: 50%;
		border: 2px solid #ddd;
		background: white;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		padding: 0;
		transition: all 0.2s ease;
		box-shadow: 0 2px 4px rgba(0,0,0,0.1);
		position: relative;
	}

	.echo-drawing-toolbar-icon {
		width: 25px;
		height: 25px;
		color: ${primaryColor};
		transition: color 0.2s ease;
	}

	.echo-drawing-toolbar-button:hover {
		transform: scale(1.05);
		border-color: ${hoverColor};
	}

	.echo-drawing-toolbar-button[data-selected="true"] {
		background: color-mix(in srgb, ${primaryColor}, white 90%);
		border-color: ${primaryColor};
	}

	.echo-drawing-toolbar-button[data-selected="true"] .echo-drawing-toolbar-icon {
		color: ${primaryColor};
	}
`
}
