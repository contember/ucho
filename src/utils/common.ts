export const deepMerge = (target: any, source: any): any => {
	if (!source) return target
	const result = { ...target }
	for (const key of Object.keys(source)) {
		if (key === '__proto__' || key === 'constructor' || key === 'prototype') continue
		if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
			result[key] = deepMerge(target[key] ?? {}, source[key])
		} else {
			result[key] = source[key]
		}
	}
	return result
}

export const debounce = <T extends (...args: any[]) => void>(func: T, wait: number) => {
	let timeout: number | undefined

	return (...args: Parameters<T>) => {
		clearTimeout(timeout)
		timeout = window.setTimeout(() => func(...args), wait)
	}
}
