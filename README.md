<p align="center">
  <img src="https://raw.githubusercontent.com/contember/ucho/main/.github/assets/ucho-icon.png" width="256" alt="Ucho">
</p>

# Ucho

A lightweight tool for capturing user feedback with screenshots, annotations, and debug information. Built with Solid.js and designed to seamlessly integrate into any web application.

## Features

- **Screenshot Capture**: Automatically capture the current page state
- **Drawing Tools**: Annotate screenshots with rectangles and freehand paths in multiple colors
- **Custom Inputs**: Add your own form fields (text, textarea, select, radio, checkbox)
- **Customizable UI**: Configurable colors, position, and text
- **Framework Agnostic**: Works with any web application
- **Easy Integration**: Simple setup with NPM or direct script inclusion
- **Rich Metadata**: Captures browser info, network info, location, timezone, and console entries

## Usage

### Using as an NPM Package

```typescript
import { init } from 'ucho-js'

init({
	onSubmit: async (data) => {
		console.log('Feedback submitted:', data)
	},
})
```

### Using Directly in HTML

```html
<script type="module">
  import { init } from 'https://esm.sh/ucho-js'

  init({
    onSubmit: async (data) => {
      console.log('Feedback submitted:', data)
    }
  })
</script>
```

### Using with React

```tsx
import { useEffect, useRef } from 'react'
import { init } from 'ucho-js'
import type { Config, UchoInstance } from 'ucho-js'

function useUcho(config: Config) {
	const instance = useRef<UchoInstance | null>(null)
	const initial = useRef(config)

	// Mount once. `init()` tears the widget down and rebuilds it, so keying this
	// on `config` would restart it whenever the caller passes a fresh object
	// literal — which is the normal way to call the hook.
	useEffect(() => {
		instance.current = init(initial.current)
		return () => {
			instance.current?.()
			instance.current = null
		}
	}, [])

	// Later changes are pushed into the running widget instead of remounting it,
	// so every option stays live — not just `onSubmit`.
	useEffect(() => {
		instance.current?.update(config)
	}, [config])
}
```

## Configuration Options

| Option                | Type                                                           | Required | Default          | Description                                                                                             |
| --------------------- | -------------------------------------------------------------- | -------- | ---------------- | ------------------------------------------------------------------------------------------------------- |
| `onSubmit`            | `(data: FeedbackPayload) => Promise<Response \| void>`         | No\*     | -                | Callback function when feedback is submitted. Return a `Response` to enable success/error notifications |
| `position`            | `'top-left' \| 'top-right' \| 'bottom-left' \| 'bottom-right'` | No       | `'bottom-right'` | Widget position on the page                                                                             |
| `primaryColor`        | `` `#${string}` ``                                             | No       | `'#1a1a1a'`      | Primary color for UI elements                                                                           |
| `textConfig`          | `Partial<TextConfig>`                                          | No       | English defaults | Customize all text elements in the interface                                                            |
| `customInputs`        | `CustomInputConfig[]`                                          | No       | `[]`             | Custom input fields added to the feedback form                                                          |
| `disableMinimization` | `boolean`                                                      | No       | `false`          | Disable the launcher button minimization after inactivity                                               |
| `fancyIcon`           | `boolean`                                                      | No       | `false`          | Use the fancy PNG icon instead of the default SVG icon                                                  |
| `chat`                | `ChatConfig`                                                   | No\*     | -                | Enables the support chat panel. Omit it and the widget behaves exactly as before                        |

\* At least one of `onSubmit` and `chat` is required — a widget that can neither take
feedback nor hold a conversation has nothing to offer. Supply only `chat` for a chat-only
widget: the feedback form, its route from the launcher, and the unsubmitted-drafts list
all disappear with `onSubmit`.

### What the Launcher Opens

With **one** of the two configured, the launcher opens it directly — there is nothing to
choose between.

With **both**, it opens a signpost instead. Getting an answer and putting a problem on
record are different promises, and neither is the one the launcher gets to pick silently,
so the two are offered side by side with the same weight — chat carrying its unread count
and whatever `chat.availability()` reports, feedback its own line. The chat panel then
keeps a back arrow to the signpost, and the welcome bubble opens it too. Every string is
in `textConfig.menu`:

```typescript
init({
	onSubmit: async (data) => {/* ... */},
	chat: {/* ... */},
	textConfig: {
		menu: {
			title: 'How can we help?',
			chatTitle: 'Chat with us',
			chatDescription: 'Ask a question and get an answer right here.',
			feedbackTitle: 'Send feedback',
			feedbackDescription: 'Report a problem or suggest an improvement.',
		},
	},
})
```

### Custom Inputs

You can add custom form fields to the feedback form:

```typescript
init({
	onSubmit: async (data) => {/* ... */},
	customInputs: [
		{
			id: 'category',
			type: 'select',
			label: 'Category',
			options: [
				{ value: 'bug', label: 'Bug Report' },
				{ value: 'feature', label: 'Feature Request' },
			],
		},
		{
			id: 'mood',
			type: 'radio',
			label: 'How are you feeling?',
			options: [
				{ value: 'happy', label: 'Happy' },
				{ value: 'neutral', label: 'Neutral' },
				{ value: 'frustrated', label: 'Frustrated' },
			],
		},
	],
})
```

Supported input types: `text`, `textarea`, `select`, `radio`, `checkbox`.

## Support Chat

Passing a `chat` adapter adds a two-way support conversation. With `onSubmit` alongside it
the launcher opens the signpost described above; on its own it opens the conversation
directly. Ucho never talks to a server itself — the host supplies the transport, exactly as
it does for `onSubmit`.

```typescript
init({
	onSubmit: async (data) => {/* ... */},
	chat: {
		// Loaded when the widget starts.
		history: async () => ({ messages: await fetchMessages() }),
		// Must resolve with at least the message just sent.
		send: async ({ text, screenshot, page, metadata }) => ({
			messages: [await postMessage({ text, screenshot, page, metadata })],
		}),
		// Push changes in; return the teardown.
		subscribe: (onTranscript) => {
			const timer = setInterval(async () => {
				const { messages, removed } = await fetchSince(cursor)
				onTranscript({ messages, removed })
			}, 5000)
			return () => clearInterval(timer)
		},
		// Optional. Shown under the title; never blocks sending.
		availability: async () => ({
			state: 'online',
			message: 'Usually replies within an hour',
		}),
	},
})
```

`history`, `send` and `subscribe` may each report the whole transcript or only what
changed. Messages are upserted by `id`, so re-sending one replaces it — that is how an
edit arrives.

A message's files arrive as `attachments` — `{ url, fileName?, fileType? }` — where the
URL is served by the host rather than being the `data:` URL that was uploaded, so a
transcript does not re-send megabytes on every poll. Images render inline; anything else
is offered as a link. The outgoing `screenshot` is still a `data:` URL, because that is
what the widget captures.

An inline image opens at full size when it is clicked. The panel is 360px wide and an
annotated screenshot is usually a whole viewport, so in the transcript it is a thumbnail
of the thing it is pointing at. The viewer closes on Escape, on the backdrop, or on its
own button, and the conversation stays open behind it. It is a link as well as a viewer,
so a middle click or a modifier click opens the original in a new tab, as it does for any
other attachment.

Long messages are expected in both directions. The composer grows with the draft up to a
cap and scrolls past it. A new answer taller than the transcript is shown from its first
line rather than its last, unless the user has scrolled up to reread something, in which
case they are left where they are. Opening the panel with unread answers lands on the
oldest of them the same way. The header has a button that enlarges the panel to the
full height above the launcher and up to 720px wide; the choice is remembered in
`localStorage`. Its labels are `textConfig.chat.expandPanelTitle` and `shrinkPanelTitle`.

Deletions must be named in `removed`. A message simply missing from a payload is never
treated as deleted, because that is indistinguishable from a delta that does not mention
it. Retracting an unread answer also takes it back off the unread badge.

Every outgoing message carries `page` (the current URL and path). The fuller `metadata`
— device, network and the captured console buffer — is included **only** when the user
attached a screenshot, since that is the deliberate act of reporting a problem. Strip
anything sensitive in your own handler before forwarding it.

### Emoji

A message's `text` is rendered as plain text. Unicode emoji therefore need no handling at
all — 🎉 typed into the composer reaches your backend as 🎉, and one coming back from an
agent renders as 🎉.

Slack is the case that needs work, because its API does not return Unicode: emoji sit in
`text` in colon form, `:tada:`, whether they were picked, typed, or added as a reaction.
Handed to ucho unchanged they display as the literal characters `:tada:`. Resolve them in
the adapter, which is already where the Slack API is being called:

```typescript
// Any shortcode table will do — emojibase, node-emoji, your own JSON.
import { shortcodes } from './shortcodes'

const resolveEmoji = (text: string): string =>
	text.replace(
		/:([a-z0-9_+-]+):/gi,
		(match, name: string) => shortcodes[name] ?? match,
	)

const read = async (response: Response) => {
	const body = await response.json()
	return {
		messages: body.messages.map((message: ChatMessage) => ({
			...message,
			text: resolveEmoji(message.text),
		})),
	}
}
```

A workspace's custom emoji — `:shipit:` and friends — are not in any table; they exist
only as images, which `emoji.list` maps names to (following an `alias:name` entry once to
reach the real one). There is nowhere for an image to go in a plain-text message, so the
unresolved name is what shows, and that is the intended degradation rather than a gap:
`text` is escaped precisely so that a compromised or careless backend cannot put markup
into the widget. Rendering custom emoji properly means giving `ChatMessage` a structured
body instead of a string — worth opening an issue for if your workspace leans on them.

Nothing is needed in the outgoing direction. Slack accepts Unicode in message text, so
whatever the user picks from their OS keyboard can be posted as-is.

### Connecting it to a backend

The adapter is where ucho ends and your service begins. A polling integration usually
looks like this — note that the cursor is yours to keep: `ChatTranscript` deliberately
does not carry one, because paging is the transport's concern.

```typescript
function createChat(baseUrl: string, token: string): ChatConfig {
	const auth = { Authorization: `Bearer ${token}` }
	let cursor: string | null = null

	const read = async (response: Response) => {
		if (!response.ok) throw new Error(`chat backend responded ${response.status}`)
		const body = await response.json()
		cursor = body.cursor ?? cursor
		return { messages: body.messages ?? [], removed: body.removed ?? [] }
	}

	return {
		history: async () =>
			read(await fetch(`${baseUrl}/history`, { headers: auth })),
		send: async (message) =>
			read(
				await fetch(`${baseUrl}/message`, {
					method: 'POST',
					headers: { ...auth, 'Content-Type': 'application/json' },
					body: JSON.stringify(message),
				}),
			),
		subscribe: (onTranscript) => {
			const timer = setInterval(async () => {
				const query = cursor
					? `history?since=${encodeURIComponent(cursor)}`
					: 'history'
				try {
					onTranscript(
						await read(await fetch(`${baseUrl}/${query}`, { headers: auth })),
					)
				} catch {
					// A failed poll is not worth surfacing; the next one may succeed.
				}
			}, 5000)
			return () => clearInterval(timer)
		},
	}
}
```

A working version of this is in `examples/react-spa`, which runs against the in-memory
demo adapter by default and against a real service when `.env.local` provides
`VITE_CHAT_BASE` and `VITE_CHAT_TOKEN`.

**Mint the token on your server, not in the page.** The browser holds a short-lived
credential it was handed; if the page could mint its own, the identity it carries would
be worth nothing. Keep the polling interval honest too — back off while the tab is
hidden and while the conversation is quiet, because this runs on every open tab.

Chat cannot be added by a later `update()`: it has to be present at `init()`. Setting
`chat` to `undefined` afterwards does hide the panel.

## Updating Options

`init()` returns the cleanup function with an `update()` method, so options can change
without tearing the widget down:

```typescript
const ucho = init({ onSubmit })
ucho.update({ primaryColor: '#4a9eed' })
ucho() // still the cleanup function
```

`update()` validates its argument and throws on an invalid one, so wrap it if the values
come from free-form input.

## Feedback Payload Structure

The `onSubmit` callback receives a `FeedbackPayload` object:

```typescript
type FeedbackPayload = {
	message: string // User's written feedback
	screenshot?: Screenshot // `data:image/jpeg;base64,…` data URL, not bare base64
	customInputs?: Record<string, string | string[]>
	metadata: {
		userAgent: string
		browserInfo: {
			width: number // Viewport width
			height: number // Viewport height
			screenWidth: number
			screenHeight: number
			language: string
			languages: readonly string[]
			doNotTrack: string | null
			cookiesEnabled: boolean
			hardwareConcurrency: number
			deviceMemory?: number
			maxTouchPoints: number
			colorDepth: number
			pixelRatio: number
			availableWidth: number
			availableHeight: number
		}
		networkInfo: {
			effectiveType?: string
			downlink?: number
			rtt?: number
			saveData?: boolean
		}
		locationInfo: {
			url: string
			origin: string
			pathname: string
			searchParams: Record<string, string>
			referrer: string
		}
		timeInfo: {
			timezone: string
			localDateTime: string
		}
		console: Array<{
			type: 'log' | 'warn' | 'error'
			message: string
			timestamp: string
		}>
	}
}
```

## License

Apache-2.0 - see [LICENSE](LICENSE) for details.
