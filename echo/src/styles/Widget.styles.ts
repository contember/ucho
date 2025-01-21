import { StylesConfig } from '../types'

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
`
