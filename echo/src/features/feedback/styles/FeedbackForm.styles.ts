import { StylesConfig } from '~/types'

export const feedbackFormStyles = (config: StylesConfig) => {
	const { primaryColor } = config
	const hoverColor = `color-mix(in srgb, ${primaryColor}, black 10%)`
	return `
	.echo-feedback {
		position: fixed;
		bottom: 20px;
		right: 20px;
		width: min(calc(100vw - 40px), 24rem);
		z-index: 10000;
		opacity: 1;
		transform: translateY(0) scale(1);
		transform-origin: right bottom;
		transition: all 0.2s ease-out;
		visibility: visible;
	}

	.echo-feedback[data-hidden="true"] {
		opacity: 0;
		visibility: hidden;
		pointer-events: none;
		transform: translateY(10px) scale(0.95);
	}

	.echo-feedback[data-minimized="true"] {
		transform: translateX(calc(100% + 20px));
	}

	.echo-feedback-header {
		background: white;
		border-radius: 12px 12px 0 0;
		padding: 16px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border: 1px solid rgba(0, 0, 0, 0.08);
		border-bottom: none;
		box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
	}

	.echo-feedback-title {
		margin: 0;
		font-size: 1.125rem;
		font-weight: 600;
		color: #1a1a1a;
	}

	.echo-feedback-header-actions {
		display: flex;
		gap: 4px;
		margin: -8px -8px -8px 0;
	}

	.echo-feedback-header-action {
		background: transparent;
		border: none;
		padding: 8px;
		cursor: pointer;
		border-radius: 8px;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #666;
		font-size: 1.25rem;
		width: 32px;
		height: 32px;
		line-height: 1;
	}

	.echo-feedback-header-action:hover {
		background-color: rgba(0, 0, 0, 0.05);
		color: #333;
	}

	.echo-feedback-form {
		background: white;
		padding: 16px;
		border-radius: 0 0 12px 12px;
		border: 1px solid rgba(0, 0, 0, 0.08);
		border-top: none;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
	}

	.echo-feedback-form-textarea {
		width: 100%;
		min-height: 120px;
		border-radius: 8px;
		border: 1px solid rgba(0, 0, 0, 0.1);
		padding: 12px;
		margin-bottom: 16px;
		font-size: 0.9375rem;
		resize: vertical;
		background: rgba(255, 255, 255, 0.8);
		font-family: inherit;
	}

	.echo-feedback-form-textarea:focus {
		outline: none;
		border-color: ${primaryColor};
		background: white;
		box-shadow: 0 0 0 3px color-mix(in srgb, ${primaryColor}, transparent 85%);
	}

	.echo-feedback-form-textarea::placeholder {
		color: #999;
	}

	.echo-feedback-form-submit {
		width: 100%;
		color: white;
		border: none;
		padding: 12px 24px;
		border-radius: 8px;
		background: ${primaryColor};
		cursor: pointer;
		font-weight: 500;
		font-size: 0.9375rem;
	}

	.echo-feedback-form-submit:hover {
		background: ${hoverColor};
		transform: translateY(-1px);
	}

	.echo-feedback-form-submit:active {
		transform: translateY(0);
	}

	.echo-feedback-maximize {
		position: fixed;
        bottom: 20px;
        right: 20px;
        width: 48px;
        height: 48px;

        transition: all 0.3s ease-out;
        transform: scale(1);
        background: linear-gradient(135deg, ${config.primaryColor}, color-mix(in srgb, ${config.primaryColor}, white 30%));
        border: none;
        border-radius: 50%;
        width: 48px;
        height: 48px;
        cursor: pointer;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1),
                   0 8px 30px ${config.primaryColor}40;
        display: flex;
        align-items: center;
        justify-content: center;
		z-index: 999;
	}

	.echo-feedback-maximize:hover {
		transform: scale(1.1);
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15),
                   0 12px 40px ${config.primaryColor}50;
	}

	@media (max-width: 768px) {
		.echo-feedback {
			bottom: 0;
			right: 0;
			left: 0;
			width: 100%;
		}

		.echo-feedback-header,
		.echo-feedback-form {
			border-radius: 12px 12px 0 0;
			border-bottom: none;
		}

		.echo-feedback-form-textarea {
			min-height: 100px;
		}
	}
`
}
