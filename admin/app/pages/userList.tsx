import { Link } from '@contember/interface'
import { Binding } from '~/lib/binding'
import { BackButton } from '~/lib/buttons'
import { DataGridColumn, DataGridQueryFilter, DataGridTextColumn, DefaultDataGrid } from '~/lib/datagrid'
import { Slots } from '~/lib/layout'
import { AnchorButton } from '~/lib/ui/button'

export default () => {
	return (
		<>
			<Binding>
				<Slots.Actions>
					<Link to="userCreate">
						<AnchorButton>Create user</AnchorButton>
					</Link>
				</Slots.Actions>
				<Slots.Title>User list</Slots.Title>
				<Slots.Back>
					<BackButton />
				</Slots.Back>
				<>
					<DefaultDataGrid entities="User" toolbar={<DataGridQueryFilter />}>
						<DataGridColumn>
							<div className="flex gap-4" />
						</DataGridColumn>
						<DataGridTextColumn field="name" header="Name" />
						<DataGridTextColumn field="email" header="Email" />
					</DefaultDataGrid>
				</>
			</Binding>
		</>
	)
}
