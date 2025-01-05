import { ApplicationEntrypoint, PageModule, Pages } from '@contember/interface'
import { DevBar, DevPanel } from '@contember/react-devbar'
import { SlotsProvider } from '@contember/react-slots'
import { LogInIcon } from 'lucide-react'
import { LoginWithEmail } from '~/lib/dev'
import { OutdatedApplicationDialog } from '~/lib/outdated-application-dialog'
import { Toaster } from '~/lib/toast'
import { Layout } from './components/layout'
import { getConfig } from './config'

export const Application = () => {
	return (
		<SlotsProvider>
			<ApplicationEntrypoint
				{...getConfig()}
				children={
					<>
						<Toaster>
							<Pages layout={Layout} children={import.meta.glob<PageModule>('./pages/**/*.tsx', { eager: true })} />
							{import.meta.env.DEV && (
								<DevBar>
									<DevPanel heading="Login" icon={<LogInIcon />}>
										<LoginWithEmail />
									</DevPanel>
								</DevBar>
							)}
						</Toaster>
						<OutdatedApplicationDialog />
					</>
				}
			/>
		</SlotsProvider>
	)
}
