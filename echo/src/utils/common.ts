export const deepMerge = (target: any, source: any): any => {
	if (!source) return target
	const result = { ...target }
	for (const key in source) {
		if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
			result[key] = deepMerge(target[key], source[key])
		} else {
			result[key] = source[key]
		}
	}
	return result
}
