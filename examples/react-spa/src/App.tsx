import * as Dialog from '@radix-ui/react-dialog'
import * as Select from '@radix-ui/react-select'
import { useEffect, useRef, useState } from 'react'
import type { Config } from 'ucho-js'
import { init } from 'ucho-js'

type Position = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'

const positions: Position[] = ['bottom-right', 'bottom-left', 'top-right', 'top-left']

const colors = [
	{ value: '#e8a849', label: 'Amber' },
	{ value: '#7B68AE', label: 'Lavender' },
	{ value: '#4a9eed', label: 'Cerulean' },
	{ value: '#5cbf8a', label: 'Jade' },
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
	const [color, setColor] = useState('#e8a849')
	const [dialogOpen, setDialogOpen] = useState(false)

	const [config] = useState<Pick<Config, 'onSubmit' | 'customInputs'>>(() => ({
		onSubmit: async (data) => {
			console.log('Feedback submitted:', data)
			return fetch('/api/feedback', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
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
		<div className="min-h-screen relative overflow-hidden">
			{/* Grain overlay */}
			<div
				className="pointer-events-none fixed inset-0 z-50 opacity-[0.03]"
				style={{
					backgroundImage:
						`url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
					animation: 'grain-drift 8s steps(10) infinite',
				}}
			/>

			{/* Ambient glow */}
			<div
				className="pointer-events-none fixed top-[-30%] right-[-10%] w-[60vw] h-[60vw] rounded-full"
				style={{
					background: 'radial-gradient(circle, hsla(38, 92%, 60%, 0.06) 0%, transparent 70%)',
					animation: 'glow-pulse 6s ease-in-out infinite',
				}}
			/>

			<header className="relative border-b border-border/60 px-8 py-5 flex items-center justify-between backdrop-blur-sm">
				<div className="flex items-center gap-3">
					<div className="w-2 h-2 rounded-full bg-primary" />
					<span className="font-display text-lg tracking-tight">ucho</span>
					<span className="text-muted-foreground text-xs font-body ml-1 mt-0.5">playground</span>
				</div>
				<nav className="flex gap-8">
					{['Dashboard', 'Projects', 'Settings'].map(item => (
						<a
							key={item}
							href="#"
							className="text-muted-foreground no-underline text-[13px] font-medium tracking-wide uppercase hover:text-foreground transition-colors duration-300"
						>
							{item}
						</a>
					))}
				</nav>
			</header>

			<main className="relative container py-16 max-w-[920px]">
				{/* Hero */}
				<div
					className="mb-16"
					style={{ animation: 'fade-up 0.8s ease-out both' }}
				>
					<p className="text-primary text-[13px] font-medium tracking-[0.2em] uppercase mb-4">
						Feedback Widget Test Bed
					</p>
					<h1 className="font-display text-5xl md:text-6xl leading-[1.05] mb-5 tracking-tight">
						Testing the edges<br />
						<span className="italic text-primary">where things break</span>
					</h1>
					<p className="text-muted-foreground text-lg max-w-[520px] leading-relaxed">
						Tailwind v4 theme variables, Radix portals, cross-origin resources — all the things that make html2canvas sweat.
					</p>
				</div>

				{/* Cards grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
					{/* Select card */}
					<Card
						title="Radix Select"
						tag="Portal"
						delay={0.1}
					>
						<p className="text-muted-foreground text-sm mb-5 leading-relaxed">
							Dropdown rendered outside the DOM tree via portal.
						</p>
						<Select.Root value={position} onValueChange={(v) => setPosition(v as Position)}>
							<Select.Trigger className="group inline-flex items-center justify-between gap-2 rounded-lg border border-border bg-secondary/50 px-4 py-2.5 text-sm text-foreground w-full hover:border-primary/40 transition-colors duration-200 focus:outline-none focus:ring-1 focus:ring-primary/50">
								<Select.Value />
								<Select.Icon className="text-muted-foreground group-hover:text-primary transition-colors">
									<svg width="12" height="12" viewBox="0 0 12 12" fill="none">
										<path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
									</svg>
								</Select.Icon>
							</Select.Trigger>
							<Select.Portal>
								<Select.Content
									className="overflow-hidden rounded-lg border border-border bg-popover text-popover-foreground shadow-xl shadow-black/30"
									position="popper"
									sideOffset={6}
								>
									<Select.Viewport className="p-1">
										{positions.map(pos => (
											<Select.Item
												key={pos}
												value={pos}
												className="relative flex items-center rounded-md px-3 py-2 text-sm cursor-pointer outline-none data-[highlighted]:bg-primary/10 data-[highlighted]:text-primary transition-colors"
											>
												<Select.ItemText>
													{pos.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase())}
												</Select.ItemText>
											</Select.Item>
										))}
									</Select.Viewport>
								</Select.Content>
							</Select.Portal>
						</Select.Root>
					</Card>

					{/* Dialog card */}
					<Card
						title="Radix Dialog"
						tag="Portal"
						delay={0.15}
					>
						<p className="text-muted-foreground text-sm mb-5 leading-relaxed">
							Overlay + content rendered via portal. Try screenshotting while open.
						</p>
						<Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
							<Dialog.Trigger className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium cursor-pointer hover:brightness-110 transition-all duration-200 active:scale-[0.98]">
								Open Dialog
							</Dialog.Trigger>
							<Dialog.Portal>
								<Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
								<Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card text-card-foreground rounded-2xl border border-border p-8 shadow-2xl shadow-black/40 w-full max-w-md">
									<div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-5">
										<div className="w-2 h-2 rounded-full bg-primary" />
									</div>
									<Dialog.Title className="font-display text-2xl mb-2">Portal Content</Dialog.Title>
									<Dialog.Description className="text-muted-foreground text-sm leading-relaxed mb-8">
										This dialog lives in a Radix portal appended to document.body. Screenshot capture needs to handle these correctly — the styles must resolve
										in the cloned DOM.
									</Dialog.Description>
									<div className="flex gap-3">
										<Dialog.Close className="px-5 py-2.5 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium cursor-pointer hover:bg-secondary/80 transition-colors">
											Close
										</Dialog.Close>
									</div>
								</Dialog.Content>
							</Dialog.Portal>
						</Dialog.Root>
					</Card>

					{/* Code card - full width */}
					<Card
						title="Integration"
						tag="Hook"
						delay={0.2}
						className="md:col-span-2"
					>
						<Pre>
							{`import { init } from 'ucho-js'
import { useEffect, useRef } from 'react'

function useUcho(config) {
  const cleanupRef = useRef(null)
  useEffect(() => {
    cleanupRef.current = init(config)
    return () => cleanupRef.current?.()
  }, [config])
}`}
						</Pre>
					</Card>

					{/* Color card */}
					<Card
						title="Theme Colors"
						tag="CSS Vars"
						delay={0.25}
					>
						<div className="flex flex-wrap gap-2.5">
							{colors.map(c => (
								<button
									key={c.value}
									onClick={() => setColor(c.value)}
									className={`group relative px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-all duration-200 ${
										color === c.value
											? 'text-primary-foreground'
											: 'border border-border bg-secondary/50 hover:border-border text-card-foreground'
									}`}
									style={color === c.value ? { backgroundColor: c.value } : { color: c.value }}
								>
									{c.label}
								</button>
							))}
						</div>
					</Card>

					{/* Flags card */}
					<Card
						title="Cross-Origin Images"
						tag="CORS"
						delay={0.3}
					>
						<p className="text-muted-foreground text-sm mb-4 leading-relaxed">
							External images from flagcdn.
						</p>
						<div className="flex gap-3 items-center">
							{['cz', 'kr', 'fi', 'pl'].map((code, i) => (
								<img
									key={code}
									src={`https://flagcdn.com/w80/${code}.png`}
									alt={code.toUpperCase()}
									className="h-9 rounded border border-border/60 shadow-sm"
									style={{
										animation: `fade-up 0.5s ease-out ${0.4 + i * 0.08}s both`,
									}}
								/>
							))}
						</div>
					</Card>
				</div>
			</main>

			<footer className="relative border-t border-border/40 py-8 text-center">
				<p className="text-muted-foreground text-xs tracking-wide">
					<span className="font-display italic">ucho</span>
					<span className="mx-2 opacity-30">/</span>
					React + Tailwind v4 + Radix UI
				</p>
			</footer>
		</div>
	)
}

function Card({
	title,
	tag,
	children,
	delay = 0,
	className = '',
}: {
	title: string
	tag?: string
	children: React.ReactNode
	delay?: number
	className?: string
}) {
	return (
		<div
			className={`group relative bg-card/60 border border-border/60 rounded-2xl p-7 hover:border-border transition-all duration-300 ${className}`}
			style={{ animation: `fade-up 0.6s ease-out ${delay}s both` }}
		>
			<div className="flex items-center justify-between mb-4">
				<h3 className="font-display text-xl text-card-foreground">{title}</h3>
				{tag && (
					<span className="text-[11px] font-medium tracking-wider uppercase text-muted-foreground bg-secondary/80 px-2.5 py-1 rounded-full">
						{tag}
					</span>
				)}
			</div>
			{children}
		</div>
	)
}

function Pre({ children }: { children: string }) {
	return (
		<pre
			className="relative bg-background/80 border border-border/40 text-foreground/80 p-5 rounded-xl overflow-x-auto text-[13px] leading-7 mt-3 font-mono"
			style={{
				backgroundImage: 'linear-gradient(135deg, hsla(38, 92%, 60%, 0.02) 0%, transparent 50%)',
			}}
		>
			{children}
		</pre>
	)
}
