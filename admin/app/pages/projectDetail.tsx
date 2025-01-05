import { EntitySubTree, Link } from '@contember/interface'
import { Binding } from '~/lib/binding'
import { BackButton } from '~/lib/buttons'
import { DataGridColumn, DataGridEnumColumn, DataGridQueryFilter, DataGridTextColumn, DefaultDataGrid } from '~/lib/datagrid'
import { Slots } from '~/lib/layout'
import { AnchorButton } from '~/lib/ui/button'

export default () => {
	return (
		<>
			<Binding>
				<Slots.Actions>
					<Link to="projectEdit(id: $entity.id)">
						<AnchorButton>Edit</AnchorButton>
					</Link>
				</Slots.Actions>
				<Slots.Title>Project detail</Slots.Title>
				<Slots.Back>
					<BackButton />
				</Slots.Back>
				<EntitySubTree entity="Project(id = $id)" />
				<div className="flex flex-col gap-4">
					<div className="text-lg font-bold">Feedback item</div>
					<DefaultDataGrid entities="FeedbackItem" toolbar={<DataGridQueryFilter />}>
						<DataGridColumn>
							<div className="flex gap-4">
								<Link to="feedbackDetail(id: $entity.id)">
									<AnchorButton>View Feedback</AnchorButton>
								</Link>
							</div>
						</DataGridColumn>
						<DataGridTextColumn field="title" header="Title" />
						<DataGridEnumColumn field="status" header="Status" options={{ open: 'open', inProgress: 'inProgress', resolved: 'resolved' }} />
						<DataGridEnumColumn field="priority" header="Priority" options={{ low: 'low', medium: 'medium', high: 'high' }} />
					</DefaultDataGrid>
				</div>
				<div className="flex flex-col gap-4">
					<div className="text-lg font-bold">Grouping</div>
					<DefaultDataGrid entities="Grouping" toolbar={<DataGridQueryFilter />}>
						<DataGridColumn>
							<div className="flex gap-4">
								<Link to="groupingDetail(id: $entity.id)">
									<AnchorButton>View Grouping</AnchorButton>
								</Link>
							</div>
						</DataGridColumn>
						<DataGridTextColumn field="name" header="Name" />
					</DefaultDataGrid>
				</div>
			</Binding>
		</>
	)
}
