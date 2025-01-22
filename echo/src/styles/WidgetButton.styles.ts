import { StylesConfig } from '../types'

export const widgetButtonStyles = (config: StylesConfig) => `
    .echo-widget-button {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        transform: scale(1);
        background: linear-gradient(135deg, ${config.primaryColor}, color-mix(in srgb, ${config.primaryColor}, white 30%));
        border: none;
        border-radius: 50%;
        width: 48px;
        height: 48px;
        cursor: pointer;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1),
                   0 8px 30px ${config.primaryColor}40;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        z-index: 10000;
        opacity: 1;
        pointer-events: auto;
    }

    .echo-widget-button:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15),
                   0 12px 40px ${config.primaryColor}50;
    }

    .echo-widget-button:active {
        transform: scale(0.95);
    }

    .echo-widget-button[data-hidden="true"] {
        opacity: 0;
        pointer-events: none;
        transform: translateY(10px) scale(0.95);
        transition: all 0.2s ease-in-out;
    }
`
