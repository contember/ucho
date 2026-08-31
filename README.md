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

Passing a `chat` adapter turns the launcher into a two-way support conversation, with
the feedback form still reachable from the panel. Ucho never talks to a server itself —
the host supplies the transport, exactly as it does for `onSubmit`.

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

Deletions must be named in `removed`. A message simply missing from a payload is never
treated as deleted, because that is indistinguishable from a delta that does not mention
it. Retracting an unread answer also takes it back off the unread badge.

Every outgoing message carries `page` (the current URL and path). The fuller `metadata`
— device, network and the captured console buffer — is included **only** when the user
attached a screenshot, since that is the deliberate act of reporting a problem. Strip
anything sensitive in your own handler before forwarding it.

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
