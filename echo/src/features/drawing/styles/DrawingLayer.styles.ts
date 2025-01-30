import type { EnrichedStylesConfig } from '~/types'

export const drawingLayerStyles = (config: EnrichedStylesConfig) => `
    .echo-drawing-layer {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        pointer-events: none;
        user-select: none;
        -webkit-user-select: none;
    }

    .echo-drawing-layer-container {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        pointer-events: none;
        user-select: none;
        -webkit-user-select: none;
    }

    .echo-drawing-layer-container svg {
        pointer-events: auto;
    }
`
