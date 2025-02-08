import { Component, JSX } from 'solid-js'

type InputWrapperProps = {
	label?: string
	required?: boolean
	children: JSX.Element
}

export const InputWrapper: Component<InputWrapperProps> = props => {
	return (
		<div class="echo-input">
			{props.label && (
				<label class="echo-input-label">
					{props.label}
					{props.required && <span class="echo-input-required">*</span>}
				</label>
			)}
			{props.children}
		</div>
	)
}
