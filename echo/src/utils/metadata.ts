import type { BrowserInfo, LocationInfo, Metadata, NetworkInfo, TimeInfo } from '~/types'
import { getConsoleBuffer } from './console'

const collectNetworkInfo = (): NetworkInfo => {
	const connection = (navigator as any).connection
	return {
		effectiveType: connection?.effectiveType,
		downlink: connection?.downlink,
		rtt: connection?.rtt,
		saveData: connection?.saveData,
	}
}

const collectBrowserInfo = (): BrowserInfo => {
	return {
		width: window.innerWidth,
		height: window.innerHeight,
		screenWidth: window.screen.width,
		screenHeight: window.screen.height,
		language: navigator.language,
		languages: navigator.languages,
		doNotTrack: navigator.doNotTrack,
		cookiesEnabled: navigator.cookieEnabled,
		hardwareConcurrency: navigator.hardwareConcurrency,
		maxTouchPoints: navigator.maxTouchPoints,
		colorDepth: window.screen.colorDepth,
		pixelRatio: window.devicePixelRatio,
		availableWidth: window.screen.availWidth,
		availableHeight: window.screen.availHeight,
	}
}

const collectLocationInfo = (): LocationInfo => {
	const url = new URL(window.location.href)
	const searchParams: Record<string, string> = {}
	url.searchParams.forEach((value, key) => {
		searchParams[key] = value
	})

	return {
		url: url.href,
		origin: url.origin,
		pathname: url.pathname,
		searchParams,
		referrer: document.referrer,
	}
}

const collectTimeInfo = (): TimeInfo => {
	return {
		timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
		localDateTime: new Date().toISOString(),
	}
}

export const collectMetadata = (): Metadata => {
	return {
		userAgent: navigator.userAgent,
		browserInfo: collectBrowserInfo(),
		networkInfo: collectNetworkInfo(),
		locationInfo: collectLocationInfo(),
		timeInfo: collectTimeInfo(),
		console: getConsoleBuffer(),
	}
}
