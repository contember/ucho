import { zIndex } from '~/styles/zIndex'
import { StylesConfig } from '~/types'

export const echoButtonStyles = (config: StylesConfig) => `
	.echo-button-wrapper {
		position: relative;
	}

	.echo-button {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: ${zIndex.widgetButton};
		cursor: pointer;
		pointer-events: auto;
		
		background: linear-gradient(135deg, ${config.primaryColor}, color-mix(in srgb, ${config.primaryColor}, white 30%));
		border: none;
		border-radius: 50%;
		width: 48px;
		height: 48px;
		box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1),
					0 8px 30px ${config.primaryColor}40;
		
		transition: all 0.3s ease-out;
	}

	.echo-button:hover {
		transform: scale(1.1);
		box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15),
					0 12px 40px ${config.primaryColor}50;
	}

	.echo-button:active {
		transform: scale(0.95);
	}

	.echo-button-count {
		position: absolute;
		top: -6px;
		right: -6px;
		background: linear-gradient(135deg, color-mix(in srgb, ${config.primaryColor}, white 20%), color-mix(in srgb, ${config.primaryColor}, white 40%));
		color: white;
		border-radius: 12px;
		min-width: 20px;
		height: 20px;
		font-size: 11px;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0 6px;
		font-weight: 600;
		pointer-events: auto;
		cursor: pointer;
		box-shadow: 0 2px 6px ${config.primaryColor}30;
		border: 1.5px solid color-mix(in srgb, ${config.primaryColor}, white 80%);
		text-shadow: 0 1px 2px ${config.primaryColor}40;
		transform-origin: center center;
		animation: countPop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
		transition: transform 0.2s ease;
	}

	.echo-button-count:hover {
		transform: scale(1.1);
	}

	@keyframes countPop {
		0% {
			transform: scale(0);
			opacity: 0;
		}
		100% {
			transform: scale(1);
			opacity: 1;
		}
	}
`
