const linearize = (value: number): number => {
	return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
}

export const calculateLuminance = (hexColor: string): number => {
	// Remove the # if present
	let color = hexColor.replace('#', '')

	// Expand 3-digit hex to 6-digit
	if (color.length === 3) {
		color = color[0] + color[0] + color[1] + color[1] + color[2] + color[2]
	}

	// Convert hex to linear RGB
	const r = linearize(Number.parseInt(color.slice(0, 2), 16) / 255)
	const g = linearize(Number.parseInt(color.slice(2, 4), 16) / 255)
	const b = linearize(Number.parseInt(color.slice(4, 6), 16) / 255)

	// Calculate relative luminance using sRGB coefficients
	return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export const getContrastColor = (hexColor: string): string => {
	const luminance = calculateLuminance(hexColor)
	// Use white text for dark backgrounds (luminance < 0.5)
	// Use black text for light backgrounds (luminance >= 0.5)
	return luminance < 0.5 ? '#FFFFFF' : '#000000'
}
