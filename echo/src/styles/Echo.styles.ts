import type { EnrichedStylesConfig } from '~/types'
import { zIndex } from './zIndex'

export const echoStyles = (config: EnrichedStylesConfig) => `
    *, *::before, *::after {
        box-sizing: border-box;
    }

    .echo-root {
        position: absolute;
        top: 0;
        left: 0;
        z-index: ${zIndex.root};
        isolation: isolate;
        pointer-events: none;
    }

    .echo-launcher {
        position: fixed;
        z-index: ${zIndex.launcher};
        bottom: 20px;
        right: 20px;
    }

    .echo-overlay {
        position: absolute;
        z-index: ${zIndex.overlay};
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border: 3px solid ${config.primaryColor};
    }

    [data-hidden="true"], [data-hidden="false"] {
        transition: opacity 0.3s ease-in-out, visibility 0.3s ease-in-out;
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
        user-select: none;
        -webkit-user-select: none;
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
        user-select: none;
        -webkit-user-select: none;
    }
`
