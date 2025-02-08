import { Component } from 'solid-js'
import { useInputHandler } from '~/hooks/useInputHandler'
import { TextInputConfig } from '~/types'
import { InputWrapper } from './InputWrapper'

type TextInputProps = {
	config: TextInputConfig
	value: string
	onChange: (value: string) => void
}

export const TextInput: Component<TextInputProps> = props => {
	const { handleTextChange } = useInputHandler(props.onChange)

	return (
		<InputWrapper label={props.config.label} required={props.config.required}>
			<input
				type="text"
				class="echo-input-field"
				value={props.value === undefined ? '' : props.value}
				placeholder={props.config.placeholder}
				required={props.config.required}
				onInput={handleTextChange}
			/>
		</InputWrapper>
	)
}
