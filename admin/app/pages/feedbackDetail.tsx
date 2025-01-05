import { EntitySubTree, Field, Link } from '@contember/interface'
import { Binding } from '~/lib/binding'
import { BackButton } from '~/lib/buttons'
import { DataGridColumn, DataGridDateColumn, DataGridHasOneColumn, DataGridQueryFilter, DataGridTextColumn, DefaultDataGrid } from '~/lib/datagrid'
import { Slots } from '~/lib/layout'
import { AnchorButton } from '~/lib/ui/button'

export default () => {
	return (
		<>
			<Binding>
				<Slots.Actions>
					<Link to="feedbackEdit(id: $entity.id)">
						<AnchorButton>Edit</AnchorButton>
					</Link>
				</Slots.Actions>
				<Slots.Title>Feedback detail</Slots.Title>
				<Slots.Back>
					<BackButton />
				</Slots.Back>
				<EntitySubTree entity="FeedbackItem(id = $id)" />
				<div className="flex flex-col gap-4">
					<div className="text-lg font-bold">Comment</div>
					<DefaultDataGrid entities="Comment" toolbar={<DataGridQueryFilter />}>
						<DataGridColumn>
							<div className="flex gap-4" />
						</DataGridColumn>
						<DataGridTextColumn field="content" header="Content" />
						<DataGridHasOneColumn field="user" header="User">
							<Field field="name" />
						</DataGridHasOneColumn>
						<DataGridDateColumn field="date" header="Date" />
					</DefaultDataGrid>
				</div>
			</Binding>
		</>
	)
}
