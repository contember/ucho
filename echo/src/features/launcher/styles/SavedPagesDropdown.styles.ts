import type { EnrichedStylesConfig } from '~/types'
import { zIndex } from '~/styles'

export const savedPagesDropdownStyles = (config: EnrichedStylesConfig) => `
	.echo-saved-pages-dropdown {
		position: absolute;
		bottom: calc(100% + 16px);
		right: 0;
		width: 320px;
		background: white;
		border-radius: 12px;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15),
					0 8px 32px ${config.primaryColor}20;
		overflow: hidden;
		animation: dropdownSlide 0.2s cubic-bezier(0.4, 0, 0.2, 1);
		border: 1px solid ${config.primaryColor}20;
		z-index: ${zIndex.widgetButton + 1};
	}

	.echo-saved-pages-header {
		padding: 16px;
		border-bottom: 1px solid ${config.primaryColor}10;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.echo-saved-pages-header h3 {
		margin: 0;
		font-size: 16px;
		font-weight: 600;
		color: #1a1a1a;
	}

	.echo-saved-pages-close {
		background: none;
		border: none;
		width: 24px;
		height: 24px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 20px;
		color: #666;
		cursor: pointer;
		border-radius: 4px;
		transition: all 0.2s;
		padding: 0;
		line-height: 1;
	}

	.echo-saved-pages-close:hover {
		background-color: ${config.primaryColor}10;
		color: ${config.primaryColor};
	}

	.echo-saved-pages-close:focus-visible {
		outline: 2px solid ${config.primaryColor};
		outline-offset: 2px;
	}

	.echo-saved-pages-header span {
		font-size: 14px;
		color: #666;
	}

	.echo-saved-pages-list {
		max-height: 400px;
		overflow-y: auto;
	}

	.echo-saved-pages-item {
		display: flex;
		align-items: center;
		padding: 12px 16px;
		border-bottom: 1px solid ${config.primaryColor}10;
		transition: all 0.2s;
	}

	.echo-saved-pages-item:hover {
		background-color: ${config.primaryColor}05;
	}

	.echo-saved-pages-item-current {
		background-color: ${config.primaryColor}10;
	}

	.echo-saved-pages-item-current:hover {
		background-color: ${config.primaryColor}15;
	}

	.echo-saved-pages-content {
		flex: 1;
		min-width: 0;
	}

	.echo-saved-pages-path {
		font-size: 14px;
		font-weight: 500;
		color: #1a1a1a;
		margin-bottom: 4px;
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.echo-saved-pages-path span {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		min-width: 0;
		flex: 1;
	}

	.echo-saved-pages-path span[title] {
		cursor: help;
	}

	.echo-saved-pages-preview {
		font-size: 13px;
		color: #666;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.echo-saved-pages-actions {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-left: 12px;
	}

	.echo-saved-pages-link {
		background: none;
		border: none;
		padding: 6px;
		color: #666;
		cursor: pointer;
		border-radius: 6px;
		transition: all 0.2s;
		opacity: 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.echo-saved-pages-link:hover {
		background: ${config.primaryColor}10;
		color: ${config.primaryColor};
	}

	.echo-saved-pages-link:focus-visible {
		outline: 2px solid ${config.primaryColor};
		outline-offset: 2px;
	}

	.echo-saved-pages-delete {
		background: none;
		border: none;
		padding: 6px 12px;
		font-size: 13px;
		font-weight: 500;
		cursor: pointer;
		border-radius: 6px;
		transition: all 0.2s;
		opacity: 0;
		white-space: nowrap;
	}

	.echo-saved-pages-delete:focus-visible {
		outline: 2px solid ${config.primaryColor};
		outline-offset: 2px;
	}

	.echo-saved-pages-item:hover .echo-saved-pages-link,
	.echo-saved-pages-item:hover .echo-saved-pages-delete {
		opacity: 1;
	}

	.echo-saved-pages-delete:hover {
		background-color: ${config.primaryColor}10;
	}

	.echo-saved-pages-empty {
		padding: 32px 16px;
		text-align: center;
		color: #666;
		font-size: 14px;
	}

	@keyframes dropdownSlide {
		0% {
			opacity: 0;
			transform: translateY(8px);
		}
		100% {
			opacity: 1;
			transform: translateY(0);
		}
	}
`
