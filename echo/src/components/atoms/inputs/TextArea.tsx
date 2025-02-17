import { Component } from 'solid-js'
import { useInputHandler } from '~/hooks/useInputHandler'
import type { TextAreaConfig } from '~/types'
import { InputWrapper } from './InputWrapper'

type TextAreaProps = {
	config: TextAreaConfig
	value: string
	onChange: (value: string) => void
}

export const TextArea: Component<TextAreaProps> = props => {
	const { handleTextChange } = useInputHandler(props.onChange)

	return (
		<InputWrapper label={props.config.label} required={props.config.required}>
			<textarea
				class="echo-input-field"
				id={props.config.id}
				value={props.value === undefined ? '' : props.value}
				placeholder={props.config.placeholder}
				required={props.config.required}
				rows={5}
				onInput={handleTextChange}
				aria-label={props.config.label || props.config.placeholder}
				aria-required={props.config.required}
				aria-invalid={props.value === ''}
				aria-describedby={`${props.config.id}-description`}
			/>
			<div id={`${props.config.id}-description`} class="visually-hidden">
				{props.config.placeholder}
			</div>
		</InputWrapper>
	)
}
