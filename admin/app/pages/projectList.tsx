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
					<Link to="projectCreate">
						<AnchorButton>
							Create project
						</AnchorButton>
					</Link>
				</Slots.Actions>
				<Slots.Title>
					Project list
				</Slots.Title>
				<Slots.Back>
					<BackButton />
				</Slots.Back>
				<>
					<DefaultDataGrid entities="Project" toolbar={<DataGridQueryFilter />}>
						<DataGridColumn>
							<div className="flex gap-4" />
						</DataGridColumn>
						<DataGridTextColumn field="name" header="Name" />
						<DataGridTextColumn field="description" header="Description" />
					</DefaultDataGrid>
				</>
			</Binding>
		</>
	)
}
