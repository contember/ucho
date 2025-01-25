import { zIndex } from '~/styles/zIndex'
import { StylesConfig } from '~/types'

export const tooltipStyles = (config: StylesConfig) => `
    .echo-drawing-tooltip {
        display: flex;
        text-wrap: nowrap;
        position: fixed;
        background: white;
        padding: 8px 16px;
        border-radius: 4px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        font-size: 14px;
        color: #333;
        z-index: ${zIndex.drawingTooltip};
        pointer-events: none;
        animation: echo-drawing-tooltip-fade-in 0.3s ease;
    }

    @keyframes echo-drawing-tooltip-fade-in {
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
