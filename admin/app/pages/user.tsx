import { EntitySubTree, Link, RedirectOnPersist } from '@contember/interface'
import { UserForm } from '~/app/components/forms/user-form'
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
					<Link to="user/create">
						<AnchorButton>Create user</AnchorButton>
					</Link>
				</Slots.Actions>
				<Slots.Title>User list</Slots.Title>
				<Slots.Back>
					<BackButton />
				</Slots.Back>
				<DefaultDataGrid entities="User" toolbar={<DataGridQueryFilter />}>
					<DataGridColumn>
						<div className="flex gap-4" />
					</DataGridColumn>
					<DataGridTextColumn field="name" header="Name" />
					<DataGridTextColumn field="email" header="Email" />
				</DefaultDataGrid>
			</Binding>
		</>
	)
}

export const Create = () => {
	return (
		<>
			<Binding>
				<Slots.Title>User create</Slots.Title>
				<Slots.Back>
					<BackButton />
				</Slots.Back>
				<EntitySubTree entity="User" isCreating>
					<RedirectOnPersist to="user/detail(id: $entity.id)" />
					<UserForm />
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
					<Link to="user/edit(id: $entity.id)">
						<AnchorButton>Edit</AnchorButton>
					</Link>
				</Slots.Actions>
				<Slots.Title>User detail</Slots.Title>
				<Slots.Back>
					<BackButton />
				</Slots.Back>
				<EntitySubTree entity="User(id = $id)" />
			</Binding>
		</>
	)
}

export const Edit = () => {
	return (
		<>
			<Binding>
				<Slots.Title>User edit</Slots.Title>
				<Slots.Back>
					<BackButton />
				</Slots.Back>
				<EntitySubTree entity="User(id = $id)">
					<RedirectOnPersist to="user/detail(id: $entity.id)" />
					<UserForm />
				</EntitySubTree>
			</Binding>
		</>
	)
}
