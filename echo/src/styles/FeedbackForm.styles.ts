import { StylesConfig } from '~/types'

export const feedbackFormStyles = (config: StylesConfig) => {
	const { primaryColor } = config
	const hoverColor = `color-mix(in srgb, ${primaryColor}, black 10%)`
	return `
        .echo-feedback-form {
            position: fixed;
            bottom: 80px;
            right: 20px;
            width: min(calc(100vw - 40px), 24rem);
            z-index: 10000;
            opacity: 0;
            transform: translateY(20px) scale(0.95);
            transform-origin: right bottom;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
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
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
            padding: 20px;
            width: 100%;
            backdrop-filter: blur(8px);
            border: 1px solid rgba(0, 0, 0, 0.08);
        }

        .echo-feedback-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;
        }

        .echo-header-buttons {
            display: flex;
            gap: 4px;
            margin: -8px -8px -8px 0;
        }

        .echo-feedback-title {
            margin: 0;
            font-size: 1.125rem;
            font-weight: 600;
            color: #1a1a1a;
        }

        .echo-header-button {
            background: transparent;
            border: none;
            padding: 8px;
            cursor: pointer;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background-color 0.2s ease;
            color: #666;
            font-size: 1.25rem;
            width: 32px;
            height: 32px;
            line-height: 1;
        }

        .echo-header-button:hover {
            background-color: rgba(0, 0, 0, 0.05);
            color: #333;
        }

        .echo-feedback-textarea {
            width: 100%;
            min-height: 120px;
            border-radius: 8px;
            border: 1px solid rgba(0, 0, 0, 0.1);
            padding: 12px;
            margin-bottom: 16px;
            font-size: 0.9375rem;
            resize: vertical;
            transition: border-color 0.2s ease;
            background: rgba(255, 255, 255, 0.8);
        }

        .echo-feedback-textarea:focus {
            outline: none;
            border-color: ${primaryColor};
            background: white;
        }

        .echo-feedback-textarea::placeholder {
            color: #999;
        }

        .echo-screenshot-preview {
            margin: 12px 0;
            max-height: 200px;
            overflow-y: auto;
            border: 1px solid rgba(0, 0, 0, 0.1);
            border-radius: 8px;
            padding: 8px;
            background-color: rgba(0, 0, 0, 0.02);
        }

        .echo-screenshot-image {
            display: block;
            width: 100%;
            height: auto;
            object-fit: contain;
            border-radius: 4px;
        }

        .echo-submit-button {
            width: 100%;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            background: ${primaryColor};
            cursor: pointer;
            font-weight: 500;
            font-size: 0.9375rem;
            transition: transform 0.2s ease, background-color 0.2s ease;
        }

        .echo-submit-button:hover {
            background: ${hoverColor};
            transform: translateY(-1px);
        }

        .echo-submit-button:active {
            transform: translateY(0);
        }

        .echo-form-buttons {
            display: flex;
            gap: 12px;
            margin-top: 16px;
        }

        .echo-maximize-feedback-button {
            display: flex;
            position: absolute;
            top: 0;
            left: -44px;
            width: 44px;
            height: 44px;
            border: none;
            border-radius: 8px 0 0 8px;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s ease;
            background: ${primaryColor};
            box-shadow: -4px 0 16px rgba(0, 0, 0, 0.1);
            opacity: 0;
            pointer-events: none;
        }

        .echo-feedback-form.minimized .echo-maximize-feedback-button {
            opacity: 1;
            pointer-events: auto;
        }

        .echo-maximize-feedback-button:hover {
            background-color: ${hoverColor};
            transform: translateX(-2px);
        }

        .echo-mobile-maximize-button {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 48px;
            height: 48px;
            border: none;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s ease;
            background: ${primaryColor};
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 10001;
        }

        .echo-mobile-maximize-button:hover {
            background-color: ${hoverColor};
            transform: translateY(-2px);
        }

        @media (max-width: 768px) {
            .echo-feedback-form {
                bottom: 0;
                right: 0;
                left: 0;
                width: 100%;
            }

            .echo-feedback-container {
                padding: 16px;
                border-radius: 12px 12px 0 0;
                border-bottom: none;
            }

            .echo-feedback-textarea {
                min-height: 100px;
            }

            .echo-feedback-form.minimized {
                transform: translateY(100%);
            }
        }
    `
}
