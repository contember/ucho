export const isMobileDevice = () => {
	return (
		/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.matchMedia?.('(max-width: 768px)').matches
	)
}
