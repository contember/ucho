import { Component, Match, Show, Switch } from 'solid-js'
import type {
	CheckboxInputConfig,
	CustomInputConfig,
	CustomInputValue,
	RadioInputConfig,
	SelectInputConfig,
	TextAreaConfig,
	TextInputConfig,
} from '~/types'
import { CheckboxGroup } from './inputs/checkbox-group'
import { RadioGroup } from './inputs/radio-group'
import { Select } from './inputs/select'
import { TextInput } from './inputs/text-input'
import { TextArea } from './inputs/textarea'

type CustomInputProps = {
	config: CustomInputConfig
	value: CustomInputValue
	onChange: (value: CustomInputValue) => void
}

export const CustomInput: Component<CustomInputProps> = props => {
	return (
		<Show when={props.config.type} keyed fallback={<div class="ucho-input-error">Invalid input type</div>}>
			<Switch fallback={<div class="ucho-input-error">Unsupported input type: {props.config.type}</div>}>
				<Match when={props.config.type === 'text'}>
					<TextInput {...props} value={props.value as string} config={props.config as TextInputConfig} />
				</Match>
				<Match when={props.config.type === 'textarea'}>
					<TextArea config={props.config as TextAreaConfig} value={props.value as string} onChange={props.onChange} />
				</Match>
				<Match when={props.config.type === 'radio'}>
					<RadioGroup config={props.config as RadioInputConfig} value={props.value as string} onChange={props.onChange} />
				</Match>
				<Match when={props.config.type === 'checkbox'}>
					<CheckboxGroup config={props.config as CheckboxInputConfig} value={props.value as string[]} onChange={props.onChange} />
				</Match>
				<Match when={props.config.type === 'select'}>
					<Select config={props.config as SelectInputConfig} value={props.value as string} onChange={props.onChange} />
				</Match>
			</Switch>
		</Show>
	)
}
