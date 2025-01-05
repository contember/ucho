import { Field, Link } from '@contember/interface'
import { Binding } from '~/lib/binding'
import { BackButton } from '~/lib/buttons'
import { DataGridColumn, DataGridEnumColumn, DataGridHasOneColumn, DataGridQueryFilter, DefaultDataGrid } from '~/lib/datagrid'
import { Slots } from '~/lib/layout'
import { AnchorButton } from '~/lib/ui/button'

export default () => {
	return (
		<>
			<Binding>
				<Slots.Actions>
					<Link to="feedbackCreate">
						<AnchorButton>Create feedback</AnchorButton>
					</Link>
				</Slots.Actions>
				<Slots.Title>Feedback list</Slots.Title>
				<Slots.Back>
					<BackButton />
				</Slots.Back>
				<>
					<DefaultDataGrid entities="FeedbackItem" toolbar={<DataGridQueryFilter />}>
						<DataGridColumn>
							<div className="flex gap-4" />
						</DataGridColumn>
						<DataGridEnumColumn field="status" header="Status" options={{ open: 'open', inProgress: 'inProgress', resolved: 'resolved' }} />
						<DataGridEnumColumn field="priority" header="Priority" options={{ low: 'low', medium: 'medium', high: 'high' }} />
						<DataGridHasOneColumn field="project" header="Project">
							<Field field="name" />
						</DataGridHasOneColumn>
						<DataGridHasOneColumn field="group" header="Group">
							<Field field="name" />
						</DataGridHasOneColumn>
					</DefaultDataGrid>
				</>
			</Binding>
		</>
	)
}
