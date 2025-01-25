import { StylesConfig } from '~/types'
import { zIndex } from './zIndex'

export const echoStyles = (config: StylesConfig) => `
    *, *::before, *::after {
        box-sizing: border-box;
    }

    .echo-root {
        position: relative;
        z-index: ${zIndex.root};
        isolation: isolate;
        pointer-events: none;
    }

    .echo-launcher {
        position: fixed;
        z-index: ${zIndex.launcher};
        pointer-events: auto;
        bottom: 20px;
        right: 20px;
    }

    .echo-overlay {
        position: fixed;
        z-index: ${zIndex.overlay};
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border: 3px solid ${config.primaryColor};
        transition: opacity 0.3s ease-in-out, visibility 0.3s ease-in-out, pointer-events 0.3s ease-in-out;
    }

    [data-hidden="true"] {
        opacity: 0;
        visibility: hidden;
        pointer-events: none;
    }

    [data-hidden="false"] {
        opacity: 1;
        visibility: visible;
        pointer-events: auto;
    }

    /* Hide elements when drawing is active */
    [data-hide-when-drawing="true"] {
        opacity: 1;
        visibility: visible;
        transition: opacity 0.3s ease-in-out, visibility 0.3s ease-in-out;
    }

    /* Hide elements when any parent has data-drawing="true" */
    [data-drawing="true"] [data-hide-when-drawing="true"] {
        opacity: 0;
        visibility: hidden;
        pointer-events: none;
    }
`
