import { StylesConfig } from '../types'

export const notificationStyles = (config: StylesConfig) => `
    .echo-widget-notification {
        position: absolute;
        bottom: 70px;
        right: 0px;
        width: 300px;
        padding: 24px;
        border-radius: 16px;
        font-size: 1rem;
        font-weight: 500;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
        backdrop-filter: blur(8px);
        background: white;
        border: 1px solid rgba(0, 0, 0, 0.08);
        border-top-width: 4px;
        z-index: 10000;
        transform-origin: bottom right;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
        opacity: 1;
        pointer-events: auto;
        transition: opacity 0.2s ease-in-out, transform 0.2s ease-in-out;
    }

    .echo-widget-notification:not([data-empty="true"]) {
        animation: notificationSlideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .echo-widget-notification[data-hidden="true"] {
        opacity: 0;
        pointer-events: none;
        transform: translateY(10px) scale(0.95);
    }

    .echo-widget-notification[data-empty="true"] {
        opacity: 0;
        pointer-events: none;
        transform: translateY(10px) scale(0.95);
        transition: none;
    }

    .echo-notification-hide {
        position: absolute;
        top: 16px;
        right: 16px;
        width: 24px;
        height: 24px;
        padding: 4px;
        border: none;
        background: transparent;
        color: #666;
        opacity: 0.7;
        cursor: pointer;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
        flex-shrink: 0;
    }

    .echo-notification-hide:hover {
        opacity: 1;
        background: rgba(0, 0, 0, 0.05);
        transform: scale(1.1);
    }

    .echo-notification-hide:active {
        transform: scale(0.95);
    }

    .echo-notification-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        transform: scale(1.5);
        background: rgba(0, 0, 0, 0.03);
        padding: 12px;
        border-radius: 50%;
        margin-top: 12px;
    }

    .echo-widget-notification[data-type="success"] .echo-notification-icon {
        color: ${config.primaryColor};
    }

    .echo-widget-notification[data-type="error"] .echo-notification-icon {
        color: #f44336;
    }

    .echo-notification-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
        text-align: center;
        padding: 0 12px;
    }

    .echo-notification-title {
        font-size: 1rem;
        font-weight: 600;
        color: #1a1a1a;
    }

    .echo-notification-message {
        font-size: 0.875rem;
        font-weight: normal;
        color: #666;
        line-height: 1.4;
        max-width: 100%;
    }

    .echo-widget-notification[data-type="success"] {
        border-top-color: ${config.primaryColor};
    }

    .echo-widget-notification[data-type="error"] {
        border-top-color: #f44336;
    }

    @keyframes notificationSlideIn {
        0% {
            opacity: 0;
            transform: translateY(10px) scale(0.95);
        }
        100% {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }

    @media (max-width: 768px) {
        .echo-widget-notification {
            right: 0;
            width: calc(100vw - 40px);
            height: auto;
            min-height: 180px;
            backdrop-filter: none;
            font-size: 0.9375rem;
            padding: 20px;
            gap: 16px;
            bottom: calc(100% + 20px);
        }

        .echo-notification-icon {
            transform: scale(1.3);
            padding: 10px;
            margin-top: 8px;
        }

        .echo-notification-title {
            font-size: 0.9375rem;
        }

        .echo-notification-message {
            font-size: 0.8125rem;
        }
    }
`
