import { StylesConfig } from '~/types'

export const widgetStyles = (config: StylesConfig) => `
    *, *::before, *::after {
        box-sizing: border-box;
    }

    .echo-widget {
        position: fixed;
        z-index: 1000000;
        pointer-events: auto;
        bottom: 20px;
        right: 20px;
    }

    .echo-widget-content {
        opacity: 1;
        visibility: visible;
        transition: opacity 0.3s ease-in-out, visibility 0.3s ease-in-out;
    }

    .echo-widget-content[data-hidden="true"] {
        opacity: 0;
        visibility: hidden;
    }
`
