import { StylesConfig } from '../types'

export const feedbackFormStyles = (config: StylesConfig) => {
	const { primaryColor } = config
	const hoverColor = `color-mix(in srgb, ${primaryColor}, black 10%)`
	return `
        .echo-feedback-form {
            position: fixed;
            bottom: 100px;
            right: 20px;
            width: 20rem;
            z-index: 10000;
            opacity: 0;
            transform: translateY(20px) scale(0.95);
            transform-origin: right center;
            transition: opacity 0.2s ease-in-out, transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .echo-feedback-form.visible {
            opacity: 1;
            transform: translateY(0) scale(1);
        }

        .echo-feedback-form.minimized {
            transform: translateX(calc(100% + 20px));
        }

        .echo-feedback-form[data-hidden="true"] {
            opacity: 0;
            pointer-events: none;
            user-select: none;
            transition: opacity 0.2s ease-in-out;
        }

        .echo-feedback-container {
            position: relative;
            background: white;
            border-radius: 8px 0 0 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            padding: 16px;
            width: 100%;
        }

        .echo-feedback-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;
        }

        .echo-feedback-title {
            margin: 0;
        }

        .echo-minimize-button {
            background: transparent;
            border: none;
            padding: 8px;
            cursor: pointer;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: -8px;
            margin-top: -8px;
            transition: background-color 0.2s ease;
        }

        .echo-feedback-textarea {
            width: 100%;
            height: 100px;
            border-radius: 4px;
            border: 1px solid #ddd;
        }

        .echo-screenshot-preview {
            margin-top: 8px;
            max-height: 500px;
            overflow-y: auto;
            border: 1px solid #ddd;
            border-radius: 4px;
            padding: 4px;
            background-color: #f5f5f5;
        }

        .echo-screenshot-image {
            display: block;
            width: 100%;
            height: auto;
            object-fit: contain;
            border-radius: 2px;
        }

        .echo-submit-button {
            width: 100%;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            background: ${primaryColor};
            cursor: pointer;
        }

        .echo-maximize-feedback-button {
            display: flex;
            position: absolute;
            top: 0px;
            left: -40px;
            width: 40px;
            height: 40px;
            border: none;
            border-radius: 8px 0 0 8px;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s ease;
            background: ${primaryColor};
        }

        .echo-maximize-feedback-button:hover {
            background-color: ${hoverColor} !important;
        }
    `
}
