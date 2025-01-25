import { EntitySubTree, Field, Link, RedirectOnPersist } from '@contember/interface'
import { ProjectForm } from '~/app/components/forms/project-form'
import { Binding } from '~/lib/binding'
import { BackButton } from '~/lib/buttons'
import { DataGridColumn, DataGridEnumColumn, DataGridQueryFilter, DataGridTextColumn, DefaultDataGrid } from '~/lib/datagrid'
import { Slots } from '~/lib/layout'
import { AnchorButton } from '~/lib/ui/button'

export const List = () => {
	return (
		<>
			<Binding>
				<Slots.Actions>
					<Link to="project/create">
						<AnchorButton>Create project</AnchorButton>
					</Link>
				</Slots.Actions>
				<Slots.Title>Project list</Slots.Title>
				<Slots.Back>
					<BackButton />
				</Slots.Back>
				{/* alot of vertical stuff to enable scrolling */}
				<div className="h-screen">lala</div>
				<DefaultDataGrid entities="Project" toolbar={<DataGridQueryFilter />}>
					<DataGridColumn>
						<div className="flex gap-4" />
					</DataGridColumn>
					<DataGridTextColumn field="name" header="Name" />
					<DataGridTextColumn field="description" header="Description" />
				</DefaultDataGrid>
			</Binding>
		</>
	)
}

export const Create = () => {
	return (
		<>
			<Binding>
				<Slots.Title>Project create</Slots.Title>
				<Slots.Back>
					<BackButton />
				</Slots.Back>
				<EntitySubTree entity="Project" isCreating>
					<RedirectOnPersist to="project/detail(id: $entity.id)" />
					<ProjectForm />
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
					<Link to="project/edit(id: $entity.id)">
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
								<Link to="feedback/detail(id: $entity.id)">
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
								<Link to="grouping/detail(id: $entity.id)">
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

export const Edit = () => {
	return (
		<>
			<Binding>
				<Slots.Title>Project edit</Slots.Title>
				<Slots.Back>
					<BackButton />
				</Slots.Back>
				<EntitySubTree entity="Project(id = $id)">
					<RedirectOnPersist to="project/detail(id: $entity.id)" />
					<ProjectForm />
				</EntitySubTree>
			</Binding>
		</>
	)
}
