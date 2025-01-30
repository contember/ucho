import { zIndex } from '~/styles/zIndex'
import type { EnrichedStylesConfig } from '~/types'

export const echoLauncherButtonStyles = (config: EnrichedStylesConfig) => {
	return `
		.echo-launcher-button-wrapper {
			position: relative;
		}
	
		.echo-launcher-button {
	        position: relative;
	        display: flex;
	        align-items: center;
	        justify-content: center;
	        z-index: ${zIndex.widgetButton};
	        cursor: pointer;
	        pointer-events: auto;
	        
	        background: ${config.primaryColor};
	        background: radial-gradient(
	            circle at 40% 40%, /* Move gradient origin */
			    ${config.primaryColor} 0%,
			    ${config.primaryColorLighter} 65%,
			    ${config.primaryColorLighter} 100%
	        );
	        border: none;
	        border-radius: 50%;
	        width: 48px;
	        height: 48px;
	        
	        box-shadow: 
	            2px 2px 10px var(--dark-shadow-color),
	            -8px -8px 16px var(--light-shadow-color);
	        
	        transition: all 0.3s ease-out;
		}
	
		.echo-launcher-button:hover {
		    box-shadow: 
		        4px 4px 8px var(--dark-shadow-color), 
		        -4px -4px 8px var(--light-shadow-color);
		    transform: translateY(-2px);
		}
	
		.echo-launcher-button:active {
			transform: scale(0.95);
		}
	
		.echo-launcher-button-count {
			position: absolute;
			top: -6px;
			right: -6px;
			background: ${config.primaryColor};
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
	
		.echo-launcher-button-count:hover {
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
}
