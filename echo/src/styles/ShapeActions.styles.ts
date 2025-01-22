import { StylesConfig } from '../types'

export const shapeActionsStyles = (config: StylesConfig) => `
    .echo-shape-actions {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1000000;
        display: flex;
        gap: 8px;
        background: white;
        padding: 8px;
        border-radius: 4px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .echo-shape-action-button {
        display: flex;
        padding: 4px;
        border-radius: 4px;
        border: none;
        background: transparent;
        cursor: pointer;
    }

    .echo-shape-action-button:hover {
        background: rgba(0,0,0,0.05);
    }
`
