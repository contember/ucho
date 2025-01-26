export const calculateLuminance = (hexColor: string): number => {
	// Remove the # if present
	const color = hexColor.replace('#', '')

	// Convert hex to RGB
	const r = Number.parseInt(color.substr(0, 2), 16) / 255
	const g = Number.parseInt(color.substr(2, 2), 16) / 255
	const b = Number.parseInt(color.substr(4, 2), 16) / 255

	// Calculate relative luminance using sRGB coefficients
	return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export const getContrastColor = (hexColor: string): string => {
	const luminance = calculateLuminance(hexColor)
	// Use white text for dark backgrounds (luminance < 0.5)
	// Use black text for light backgrounds (luminance >= 0.5)
	return luminance < 0.5 ? '#FFFFFF' : '#000000'
}
