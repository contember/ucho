import { StylesConfig } from '../types'

export const overlayStyles = (config: StylesConfig) => {
	const { primaryColor } = config
	return `
        .echo-overlay {
            display: relative;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            border: 3px solid ${primaryColor};
        }
    `
}
