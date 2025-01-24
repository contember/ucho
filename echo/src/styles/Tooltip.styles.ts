import { StylesConfig } from '~/types'

export const tooltipStyles = (config: StylesConfig) => `
    .echo-tooltip {
        display: flex;
        text-wrap: nowrap;
        position: fixed;
        background: white;
        padding: 8px 16px;
        border-radius: 4px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        font-size: 14px;
        color: #333;
        z-index: 1000001;
        pointer-events: none;
        animation: echo-tooltip-fade-in 0.3s ease;
    }

    @keyframes echo-tooltip-fade-in {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`
