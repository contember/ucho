import { zIndex } from '~/styles/zIndex'
import { StylesConfig } from '~/types'

export const echoButtonStyles = (config: StylesConfig) => `
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
`
