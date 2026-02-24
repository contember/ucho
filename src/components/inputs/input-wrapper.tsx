import { Component, JSX } from 'solid-js'

type InputWrapperProps = {
	label?: string
	required?: boolean
	children: JSX.Element
}

export const InputWrapper: Component<InputWrapperProps> = props => {
	return (
		<div class="ucho-input" role="group">
			{props.label && (
				<label class="ucho-input-label">
					<span>{props.label}</span>
					{props.required && (
						<span class="ucho-input-required" aria-label="Required field">
							*
						</span>
					)}
				</label>
			)}
			{props.children}
		</div>
	)
}
