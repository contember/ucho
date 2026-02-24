import { CustomInputValue } from '~/types'

export const useInputHandler = <T extends CustomInputValue>(onChange: (value: T) => void) => {
	const handleTextChange = (e: Event) => {
		const target = e.target as HTMLInputElement | HTMLTextAreaElement
		onChange(target.value as T)
	}

	const handleSelectChange = (value: string) => {
		onChange(value as T)
	}

	const handleCheckboxChange = (currentValues: string[], value: string, checked: boolean) => {
		const newValues = checked ? [...currentValues, value] : currentValues.filter((v: string) => v !== value)
		onChange(newValues as T)
	}

	const getCheckboxValue = (value: CustomInputValue): string[] => {
		return Array.isArray(value) ? value : []
	}

	return {
		handleTextChange,
		handleSelectChange,
		handleCheckboxChange,
		getCheckboxValue,
	}
}
