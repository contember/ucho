export const debounce = <T extends (...args: any[]) => void>(func: T, wait: number) => {
	let timeout: number | undefined

	return (...args: Parameters<T>) => {
		clearTimeout(timeout)
		timeout = window.setTimeout(() => func(...args), wait)
	}
}
