import { EntitySubTree, Field, Link, RedirectOnPersist } from '@contember/interface'
import { GroupingForm } from '~/app/components/forms/grouping-form'
import { Binding } from '~/lib/binding'
import { BackButton } from '~/lib/buttons'
import { DataGridColumn, DataGridHasOneColumn, DataGridQueryFilter, DataGridTextColumn, DefaultDataGrid } from '~/lib/datagrid'
import { Slots } from '~/lib/layout'
import { AnchorButton } from '~/lib/ui/button'

export const List = () => {
	return (
		<>
			<Binding>
				<Slots.Actions>
					<Link to="grouping/create">
						<AnchorButton>Create grouping</AnchorButton>
					</Link>
				</Slots.Actions>
				<Slots.Title>Grouping list</Slots.Title>
				<Slots.Back>
					<BackButton />
				</Slots.Back>
				<DefaultDataGrid entities="Grouping" toolbar={<DataGridQueryFilter />}>
					<DataGridColumn>
						<div className="flex gap-4" />
					</DataGridColumn>
					<DataGridTextColumn field="name" header="Name" />
					<DataGridHasOneColumn field="project" header="Project">
						<Field field="name" />
					</DataGridHasOneColumn>
				</DefaultDataGrid>
			</Binding>
		</>
	)
}

export const Create = () => {
	return (
		<>
			<Binding>
				<Slots.Title>Grouping create</Slots.Title>
				<Slots.Back>
					<BackButton />
				</Slots.Back>
				<EntitySubTree entity="Grouping" isCreating>
					<RedirectOnPersist to="grouping/detail(id: $entity.id)" />
					<GroupingForm />
				</EntitySubTree>
			</Binding>
		</>
	)
}

export const Detail = () => {
	return (
		<>
			<Binding>
				<Slots.Actions>
					<Link to="grouping/edit(id: $entity.id)">
						<AnchorButton>Edit</AnchorButton>
					</Link>
				</Slots.Actions>
				<Slots.Title>Grouping detail</Slots.Title>
				<Slots.Back>
					<BackButton />
				</Slots.Back>
				<EntitySubTree entity="Grouping(id = $id)" />
			</Binding>
		</>
	)
}

export const Edit = () => {
	return (
		<>
			<Binding>
				<Slots.Title>Grouping edit</Slots.Title>
				<Slots.Back>
					<BackButton />
				</Slots.Back>
				<EntitySubTree entity="Grouping(id = $id)">
					<RedirectOnPersist to="grouping/detail(id: $entity.id)" />
					<GroupingForm />
				</EntitySubTree>
			</Binding>
		</>
	)
}
