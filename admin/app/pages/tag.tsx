import { EntitySubTree, Link, RedirectOnPersist } from '@contember/interface'
import { TagForm } from '~/app/components/forms/tag-form'
import { Binding } from '~/lib/binding'
import { BackButton } from '~/lib/buttons'
import { DataGridColumn, DataGridQueryFilter, DataGridTextColumn, DefaultDataGrid } from '~/lib/datagrid'
import { Slots } from '~/lib/layout'
import { AnchorButton } from '~/lib/ui/button'

export const List = () => {
	return (
		<>
			<Binding>
				<Slots.Actions>
					<Link to="tag/create">
						<AnchorButton>Create tag</AnchorButton>
					</Link>
				</Slots.Actions>
				<Slots.Title>Tag list</Slots.Title>
				<Slots.Back>
					<BackButton />
				</Slots.Back>
				<DefaultDataGrid entities="Tag" toolbar={<DataGridQueryFilter />}>
					<DataGridColumn>
						<div className="flex gap-4" />
					</DataGridColumn>
					<DataGridTextColumn field="name" header="Name" />
					<DataGridTextColumn field="color" header="Color" />
				</DefaultDataGrid>
			</Binding>
		</>
	)
}

export const Create = () => {
	return (
		<>
			<Binding>
				<Slots.Title>Tag create</Slots.Title>
				<Slots.Back>
					<BackButton />
				</Slots.Back>
				<EntitySubTree entity="Tag" isCreating>
					<RedirectOnPersist to="tag/detail(id: $entity.id)" />
					<TagForm />
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
					<Link to="tag/edit(id: $entity.id)">
						<AnchorButton>Edit</AnchorButton>
					</Link>
				</Slots.Actions>
				<Slots.Title>Tag detail</Slots.Title>
				<Slots.Back>
					<BackButton />
				</Slots.Back>
				<EntitySubTree entity="Tag(id = $id)" />
			</Binding>
		</>
	)
}

export const Edit = () => {
	return (
		<>
			<Binding>
				<Slots.Title>Tag edit</Slots.Title>
				<Slots.Back>
					<BackButton />
				</Slots.Back>
				<EntitySubTree entity="Tag(id = $id)">
					<RedirectOnPersist to="tag/detail(id: $entity.id)" />
					<TagForm />
				</EntitySubTree>
			</Binding>
		</>
	)
}
