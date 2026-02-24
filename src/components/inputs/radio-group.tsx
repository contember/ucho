import { Component, For } from 'solid-js'
import { useInputHandler } from '~/hooks/input-handler-hooks'
import { RadioInputConfig } from '~/types'
import { InputWrapper } from './input-wrapper'

type RadioGroupProps = {
	config: RadioInputConfig
	value: string
	onChange: (value: string) => void
}

export const RadioGroup: Component<RadioGroupProps> = props => {
	const { handleSelectChange } = useInputHandler(props.onChange)

	return (
		<InputWrapper label={props.config.label} required={props.config.required}>
			<fieldset class="ucho-input-options" role="radiogroup" aria-required={props.config.required}>
				<For each={props.config.options}>
					{option => (
						<label class="ucho-input-option">
							<input
								type="radio"
								name={props.config.id}
								value={option.value}
								checked={props.value === option.value}
								required={props.config.required}
								onChange={() => handleSelectChange(option.value)}
							/>
							<span>{option.label}</span>
						</label>
					)}
				</For>
			</fieldset>
		</InputWrapper>
	)
}
