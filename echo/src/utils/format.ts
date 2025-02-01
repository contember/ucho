export const formatPath = (path: string) => {
	if (path === '/') return '/'
	const parts = path.split('/')
	if (parts.length <= 4) return path
	return `/${parts[1]}/.../${parts[parts.length - 1]}`
}
