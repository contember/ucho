import { Logo } from './logo'
import { Navigation } from './navigation'
import { Component, Link } from '@contember/interface'
import { IdentityLoader } from '~/lib/binding'
import { LayoutComponent, Slots } from '~/lib/layout'
import { PropsWithChildren } from 'react'

export const Layout = Component(({ children }: PropsWithChildren) => <IdentityLoader>
	<LayoutComponent>
		<Slots.Logo>
			<Link to="index">
				<Logo />
			</Link>
		</Slots.Logo>
		<Slots.Navigation>
			<Navigation />
		</Slots.Navigation>
		<Slots.Footer>
			<p>
				<small>
					Created with 
					<a href="https://www.contember.com/" className="content-link">
						AI-assisted Contember Studio
					</a>
				</small>
			</p>
		</Slots.Footer>
		{children}
	</LayoutComponent>
</IdentityLoader>)
