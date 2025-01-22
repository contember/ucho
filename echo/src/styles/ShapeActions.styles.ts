import { StylesConfig } from '../types'

export const shapeActionsStyles = (config: StylesConfig) => `
    .echo-shape-actions {
        position: fixed;
        z-index: 1000000;
        display: flex;
        gap: 8px;
        background: white;
        border-radius: 4px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        transform: translate(-50%, -100%) translateY(-8px);
        animation: echo-shape-actions-pop 0.1s ease-out;
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

    .echo-shape-action-button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        border-radius: 4px;
        border: none;
        background: transparent;
        cursor: pointer;
        padding: 8px;
        color: #666;
        transition: all 0.2s ease;
    }

    .echo-shape-action-button:hover {
        background: rgba(0,0,0,0.05);
        color: #333;
    }
`
