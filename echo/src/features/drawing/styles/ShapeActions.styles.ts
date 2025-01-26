import { zIndex } from '~/styles/zIndex'
import { StylesConfig } from '~/types'

export const shapeActionsStyles = (config: StylesConfig) => `
    .echo-shape-actions {
        position: fixed;
        z-index: ${zIndex.shapeActions};
        display: flex;
        gap: 2px;
        background: white;
        border-radius: 4px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        transform: translate(-50%, -100%) translateY(-8px);
        animation: echo-shape-actions-pop 0.1s ease-out;
        cursor: default;
        pointer-events: auto;
    }

    .echo-shape-actions-divider {
        width: 1px;
        margin: 8px 0;
        background: rgba(0,0,0,0.1);
        pointer-events: none;
    }

    .echo-shape-actions[hidden] {
        display: none;
    }

    @keyframes echo-shape-actions-pop {
        0% {
            opacity: 0;
            transform: translate(-50%, -100%) translateY(-4px) scale(0.95);
        }
        100% {
            opacity: 1;
            transform: translate(-50%, -100%) translateY(-8px) scale(1);
        }
    }
`
