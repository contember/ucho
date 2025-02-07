import { Component, Link } from '@contember/interface'
import { PropsWithChildren } from 'react'
import { IdentityLoader } from '~/lib/binding'
import { LayoutBoxedComponent, LayoutComponent, Slots } from '~/lib/layout'
import { Logo } from './logo'
import { Navigation } from './navigation'

export const Layout = Component(({ children }: PropsWithChildren) => (
	<IdentityLoader>
		{/* <LayoutComponent> */}
		<LayoutBoxedComponent>
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
						Created with{' '}
						<a href="https://www.contember.com/" className="content-link">
							AI-assisted Contember Studio
						</a>
					</small>
				</p>
			</Slots.Footer>
			{children}
		</LayoutBoxedComponent>
		{/* </LayoutComponent> */}
	</IdentityLoader>
))
