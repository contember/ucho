import { StylesConfig } from '~/types'
import { zIndex } from '../../../styles/zIndex'

export const welcomeMessageStyles = (config: StylesConfig) => {
	const hoverColor = `color-mix(in srgb, ${config.primaryColor}, black 10%)`
	return `
    .echo-welcome-message {
        position: fixed;
        z-index: ${zIndex.welcomeMessage};
        background: linear-gradient(135deg, ${config.primaryColor}, color-mix(in srgb, ${config.primaryColor}, white 30%));
        color: white;
        padding: 12px 20px;
        padding-right: 36px;
        border-radius: 12px;
        font-size: 14px;
        font-weight: 500;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1),
                    0 8px 30px ${config.primaryColor}40;
        opacity: 1;
        transform: translateY(0) scale(1);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        animation: echo-welcome-message-enter 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        user-select: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        cursor: pointer;
        border: none;
        text-align: left;
    }

    .echo-welcome-message:hover {
        transform: translateY(-2px) scale(1.02);
        background: linear-gradient(135deg, ${hoverColor}, color-mix(in srgb, ${hoverColor}, white 30%));
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15),
                   0 12px 40px ${config.primaryColor}50;
    }

    .echo-welcome-message:active {
        transform: translateY(0) scale(0.98);
    }

    .echo-welcome-message-close {
        position: absolute;
        top: 8px;
        right: 8px;
        width: 20px;
        height: 20px;
        padding: 2px;
        border: none;
        background: transparent;
        color: white;
        opacity: 0.7;
        cursor: pointer;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
    }

    .echo-welcome-message-close:hover {
        opacity: 1;
        background: rgba(255, 255, 255, 0.1);
        transform: scale(1.1);
    }

    .echo-welcome-message-close:active {
        transform: scale(0.95);
    }

    .echo-welcome-message::before {
        content: '';
        position: absolute;
        bottom: -8px;
        right: 20px;
        width: 16px;
        height: 16px;
        background: inherit;
        transform: rotate(45deg);
        border-radius: 3px;
        z-index: -1;
    }

    @keyframes echo-welcome-message-enter {
        0% {
            opacity: 0;
            transform: translateY(20px) scale(0.9);
        }
        100% {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }

    /* Pulsing dot animation */
    .echo-welcome-message::after {
        content: '';
        display: inline-block;
        width: 6px;
        height: 6px;
        background: white;
        border-radius: 50%;
        margin-left: 8px;
        animation: echo-welcome-message-pulse 1.5s ease-in-out infinite;
    }

    @keyframes echo-welcome-message-pulse {
        0% {
            transform: scale(1);
            opacity: 1;
        }
        50% {
            transform: scale(1.5);
            opacity: 0.5;
        }
        100% {
            transform: scale(1);
            opacity: 1;
        }
    }
`
}
