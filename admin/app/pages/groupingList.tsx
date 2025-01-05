import { Field, Link } from '@contember/interface'
import { Binding } from '~/lib/binding'
import { BackButton } from '~/lib/buttons'
import { DataGridColumn, DataGridHasOneColumn, DataGridQueryFilter, DataGridTextColumn, DefaultDataGrid } from '~/lib/datagrid'
import { Slots } from '~/lib/layout'
import { AnchorButton } from '~/lib/ui/button'

export default () => {
	return (
		<>
			<Binding>
				<Slots.Actions>
					<Link to="groupingCreate">
						<AnchorButton>
							Create grouping
						</AnchorButton>
					</Link>
				</Slots.Actions>
				<Slots.Title>
					Grouping list
				</Slots.Title>
				<Slots.Back>
					<BackButton />
				</Slots.Back>
				<>
					<DefaultDataGrid entities="Grouping" toolbar={<DataGridQueryFilter />}>
						<DataGridColumn>
							<div className="flex gap-4" />
						</DataGridColumn>
						<DataGridTextColumn field="name" header="Name" />
						<DataGridHasOneColumn field="project" header="Project">
							<Field field="name" />
						</DataGridHasOneColumn>
					</DefaultDataGrid>
				</>
			</Binding>
		</>
	)
}
