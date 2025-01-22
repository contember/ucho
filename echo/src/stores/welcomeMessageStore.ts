import { createSignal } from 'solid-js'

const [isClosing, setIsClosing] = createSignal(false)

export const welcomeMessageStore = {
	isClosing,
	setIsClosing,
}
