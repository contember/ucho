import { Component, For, Show, createSignal } from 'solid-js'
import { useInputHandler } from '~/hooks/useInputHandler'
import type { SelectInputConfig, SelectOption } from '~/types'
import { registerWindowEventListener } from '~/utils'
import { InputWrapper } from './InputWrapper'

type SelectProps = {
	config: SelectInputConfig
	value: string
	onChange: (value: string) => void
}

export const Select: Component<SelectProps> = props => {
	const { handleSelectChange } = useInputHandler(props.onChange)
	const [isOpen, setIsOpen] = createSignal(false)
	let selectRef: HTMLDivElement | undefined
	let triggerRef: HTMLButtonElement | undefined
	let hiddenInputRef: HTMLInputElement | undefined
	const selectedOption = () => props.config.options.find(opt => opt.value === (props.value === undefined ? '' : props.value))

	const handleSelect = (option: SelectOption, e: MouseEvent) => {
		e.stopPropagation()
		if (option.value === props.value) {
			if (!props.config.required) {
				handleSelectChange('')
			}
		} else {
			handleSelectChange(option.value)
		}
		setIsOpen(false)
	}

	const toggleDropdown = () => {
		setIsOpen(!isOpen())
	}

	const handleClickOutside = (e: MouseEvent) => {
		if (!isOpen() || !selectRef) return
		const path = e.composedPath()
		if (!path.includes(selectRef)) {
			setIsOpen(false)
		}
	}

	registerWindowEventListener({ event: 'mousedown', callback: handleClickOutside })

	return (
		<InputWrapper label={props.config.label} required={props.config.required}>
			<div class="echo-select" ref={selectRef}>
				<button
					type="button"
					ref={triggerRef}
					class="echo-select-trigger"
					onClick={e => {
						e.stopPropagation()
						toggleDropdown()
					}}
					data-open={isOpen()}
					data-placeholder={!props.value}
					data-required={props.config.required}
					aria-haspopup="listbox"
					aria-expanded={isOpen()}
					aria-required={props.config.required}
				>
					<span>{selectedOption()?.label || props.config.placeholder}</span>
					<svg
						class="echo-select-arrow"
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<path d="m6 9 6 6 6-6" />
					</svg>
				</button>

				<Show when={isOpen()}>
					<div class="echo-select-dropdown" role="listbox">
						<For each={props.config.options}>
							{option => (
								<button
									type="button"
									class="echo-select-option"
									role="option"
									aria-selected={option.value === props.value}
									onClick={e => handleSelect(option, e)}
									data-selected={option.value === props.value}
								>
									{option.label}
								</button>
							)}
						</For>
					</div>
				</Show>

				<input
					ref={hiddenInputRef}
					type="text"
					class="visually-hidden"
					value={props.value === undefined ? '' : props.value}
					required={props.config.required}
					aria-hidden="true"
				/>
			</div>
		</InputWrapper>
	)
}
