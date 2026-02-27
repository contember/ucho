import { Component, For } from 'solid-js'
import { useInputHandler } from '~/hooks/input-handler-hooks'
import { CheckboxInputConfig } from '~/types'
import { InputWrapper } from './input-wrapper'

type CheckboxGroupProps = {
	config: CheckboxInputConfig
	value: string[]
	onChange: (value: string[]) => void
}

export const CheckboxGroup: Component<CheckboxGroupProps> = props => {
	const { handleCheckboxChange, getCheckboxValue } = useInputHandler(props.onChange)
	const values = () => getCheckboxValue(props.value)
	const isAnySelected = () => values().length > 0

	return (
		<InputWrapper label={props.config.label} required={props.config.required}>
			<fieldset class="ucho-input-options" role="group" aria-required={props.config.required}>
				<For each={props.config.options}>
					{(option, index) => (
						<label class="ucho-input-option">
							<input
								type="checkbox"
								value={option.value}
								checked={values().includes(option.value)}
								required={props.config.required && !isAnySelected() && index() === 0}
								onChange={e => handleCheckboxChange(values(), option.value, e.currentTarget.checked)}
							/>
							<span>{option.label}</span>
						</label>
					)}
				</For>
			</fieldset>
		</InputWrapper>
	)
}
