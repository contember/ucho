import { describe, expect, test } from 'bun:test'
import { resolveTextConfig } from '~/config/default-text'
import type { TextConfig } from '~/types'

const feedbackOnly = { feedback: true, chat: false }

/** A host's translated form, written the way hosts write it: every label, no busy label. */
const translatedForm: TextConfig['feedbackForm'] = {
	title: 'Zpětná vazba',
	placeholder: 'Co vás napadlo?',
	screenshotAlt: 'Náhled snímku',
	submitButton: 'Odeslat zpětnou vazbu',
	minimizeTitle: 'Minimalizovat',
	expandTitle: 'Rozbalit',
	closeTitle: 'Zavřít',
	showFormTitle: 'Zobrazit formulář',
}

describe('the busy label of the submit button', () => {
	test('is the English default when the host translates nothing', () => {
		expect(resolveTextConfig(undefined, feedbackOnly).feedbackForm.submittingButton).toBe('Sending…')
	})

	test("keeps a host's translated submit label rather than an English word", () => {
		const texts = resolveTextConfig({ feedbackForm: translatedForm }, feedbackOnly)
		expect(texts.feedbackForm.submittingButton).toBe('Odeslat zpětnou vazbu')
		expect(texts.feedbackForm.title).toBe('Zpětná vazba')
	})

	test("is the host's own busy label when it sets one", () => {
		const texts = resolveTextConfig({ feedbackForm: { ...translatedForm, submittingButton: 'Odesílám…' } }, feedbackOnly)
		expect(texts.feedbackForm.submittingButton).toBe('Odesílám…')
	})

	test('leaves the texts the host did not translate at their defaults', () => {
		const texts = resolveTextConfig({ feedbackForm: translatedForm }, feedbackOnly)
		expect(texts.welcomeMessage.text).toBe('Click here to leave feedback')
		expect(texts.notification.errorTitle).toBe(resolveTextConfig(undefined, feedbackOnly).notification.errorTitle)
	})
})
