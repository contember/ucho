import { useEffect, useRef, useState } from 'react'
import type { Config } from 'ucho-js'
import { init } from 'ucho-js'

type Position = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'

const positions: Position[] = ['bottom-right', 'bottom-left', 'top-right', 'top-left']

const colors = [
	{ value: '#B06BA3', label: 'Rose' },
	{ value: '#7B68AE', label: 'Lavender' },
	{ value: '#0ea5e9', label: 'Blue' },
	{ value: '#10b981', label: 'Green' },
] as const

function useUcho(config: Config) {
	const cleanupRef = useRef<(() => void) | null>(null)

	useEffect(() => {
		cleanupRef.current = init(config)
		return () => {
			cleanupRef.current?.()
			cleanupRef.current = null
		}
	}, [config])
}

export function App() {
	const [position, setPosition] = useState<Position>('bottom-right')
	const [color, setColor] = useState('#B06BA3')

	// Memoize config so the effect doesn't re-run on every render
	const [config] = useState<Pick<Config, 'onSubmit' | 'customInputs'>>(() => ({
		onSubmit: async (data) => {
			console.log('Feedback submitted:', data)
			// In a real app, send to your backend:
			// return fetch('/api/feedback', { method: 'POST', body: JSON.stringify(data) })
		},
		customInputs: [
			{
				id: 'category',
				type: 'select' as const,
				label: 'Category',
				options: [
					{ value: 'bug', label: 'Bug Report' },
					{ value: 'feature', label: 'Feature Request' },
					{ value: 'improvement', label: 'Improvement' },
				],
			},
			{
				id: 'mood',
				type: 'radio' as const,
				label: 'How are you feeling?',
				options: [
					{ value: 'happy', label: 'Happy' },
					{ value: 'neutral', label: 'Neutral' },
					{ value: 'frustrated', label: 'Frustrated' },
				],
			},
		],
	}))

	useUcho({ ...config, position: 'bottom-left' })

	return (
		<>
			<style>{`
				*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
				body { font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; color: #1a1a2e; background: #fafafa; }
			`}</style>

			<header style={{
				background: '#fff',
				borderBottom: '1px solid #e5e7eb',
				padding: '1rem 2rem',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'space-between',
			}}>
				<h1 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Acme App</h1>
				<nav style={{ display: 'flex', gap: '1.5rem' }}>
					{['Dashboard', 'Projects', 'Settings'].map(item => (
						<a key={item} href="#" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500 }}>
							{item}
						</a>
					))}
				</nav>
			</header>

			<main style={{ maxWidth: 800, margin: '3rem auto', padding: '0 2rem' }}>
				<div style={{ textAlign: 'center', marginBottom: '3rem' }}>
					<h2 style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>Ucho - React SPA Example</h2>
					<p style={{ color: '#6b7280', fontSize: '1.1rem' }}>
						Integrating the ucho feedback widget in a React application.
					</p>
				</div>

				<Card title="Integration">
					<p>
						The widget is initialized via a custom <code>useUcho</code> hook that
						handles cleanup on unmount and reinitializes when config changes.
					</p>
					<Pre>{`import { init } from 'ucho-js'
import { useEffect, useRef } from 'react'

function useUcho(config) {
  const cleanupRef = useRef(null)

  useEffect(() => {
    cleanupRef.current = init(config)
    return () => {
      cleanupRef.current?.()
      cleanupRef.current = null
    }
  }, [config])
}`}</Pre>
				</Card>

				<Card title="Position">
					<div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
						{positions.map(pos => (
							<Button key={pos} active={position === pos} onClick={() => setPosition(pos)}>
								{pos.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase())}
							</Button>
						))}
					</div>
				</Card>

				<Card title="Color">
					<div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
						{colors.map(c => (
							<Button key={c.value} active={color === c.value} onClick={() => setColor(c.value)} style={{ color: c.value }}>
								{c.label}
							</Button>
						))}
					</div>
				</Card>
			</main>

			<footer style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af', fontSize: '0.8rem' }}>
				Ucho React Example &mdash; ucho
			</footer>
		</>
	)
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
	return (
		<div style={{
			background: '#fff',
			border: '1px solid #e5e7eb',
			borderRadius: 12,
			padding: '2rem',
			marginBottom: '1.5rem',
		}}>
			<h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{title}</h3>
			{children}
		</div>
	)
}

function Button({ active, children, onClick, style }: {
	active: boolean
	children: React.ReactNode
	onClick: () => void
	style?: React.CSSProperties
}) {
	return (
		<button
			onClick={onClick}
			style={{
				padding: '0.5rem 1rem',
				border: '1px solid',
				borderColor: active ? '#B06BA3' : '#e5e7eb',
				borderRadius: 8,
				background: active ? '#B06BA3' : '#fff',
				color: active ? '#fff' : undefined,
				cursor: 'pointer',
				fontSize: '0.85rem',
				fontWeight: 500,
				...style,
				...(active ? { color: '#fff' } : {}),
			}}
		>
			{children}
		</button>
	)
}

function Pre({ children }: { children: string }) {
	return (
		<pre style={{
			background: '#1a1a2e',
			color: '#e5e7eb',
			padding: '1.25rem',
			borderRadius: 8,
			overflowX: 'auto',
			fontSize: '0.85rem',
			lineHeight: 1.7,
			marginTop: '1rem',
		}}>
			{children}
		</pre>
	)
}
