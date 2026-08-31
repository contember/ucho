const NAVIGABLE_PROTOCOLS = new Set(['http:', 'https:'])

/**
 * Attachment URLs arrive over the chat adapter, which is supplied by the host and fed by
 * whatever its backend stores — so they are input, not something to trust. A
 * `javascript:` URI rendered into an `href` runs in the host page's origin, which for an
 * admin application is as bad as it gets.
 *
 * `data:` is allowed only for images, so an adapter can echo a freshly captured
 * screenshot locally without opening a path to `data:text/html`.
 *
 * @returns the URL when it is safe to render, otherwise `null`.
 */
export const safeMediaUrl = (url: string | undefined): string | null => {
	if (!url) return null
	if (/^data:image\/(png|jpeg|jpg|webp|gif|avif);/i.test(url)) return url

	try {
		// Parsed without a base on purpose: only an absolute reference can carry a scheme,
		// and the scheme is the whole question here. `URL` trims leading whitespace, so
		// `" javascript:…"` is still recognised as what it is.
		return NAVIGABLE_PROTOCOLS.has(new URL(url).protocol) ? url : null
	} catch {
		// Not absolute, so it carries no scheme and cannot introduce one — a relative path
		// to the host's own attachment storage is a legitimate thing to serve.
		return url
	}
}
