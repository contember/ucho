import { StylesConfig } from '../types'

export const widgetButtonStyles = (config: StylesConfig) => `
    .echo-widget-button {
        transition: all 0.3s ease;
        transform: scale(1);
        background: ${config.primaryColor};
        border: none;
        border-radius: 50%;
        width: 48px;
        height: 48px;
        cursor: pointer;
        box-shadow: 0 2px 8px rgba(0,0,0,0.15);
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
        box-shadow: 0 4px 12px rgba(0,0,0,0.2) !important;
    }

    .echo-widget-button:active {
        transform: scale(0.95);
    }

    .echo-widget-button[data-hidden="true"] {
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.2s ease-in-out;
    }
`
