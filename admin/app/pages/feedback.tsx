import { EntitySubTree, Field, Link, RedirectOnPersist } from '@contember/interface'
import { FeedbackItemForm } from '~/app/components/forms/feedback-item-form'
import { AlertDialog, AlertDialogContent, AlertDialogTrigger, Dialog, DialogContent, DialogTrigger } from '~/lib'
import { Binding } from '~/lib/binding'
import { BackButton } from '~/lib/buttons'
import {
	DataGridColumn,
	DataGridDateColumn,
	DataGridEnumColumn,
	DataGridHasOneColumn,
	DataGridQueryFilter,
	DataGridTextColumn,
	DefaultDataGrid,
} from '~/lib/datagrid'
import { Slots } from '~/lib/layout'
import { AnchorButton } from '~/lib/ui/button'

export const aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa = () => {
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
				<EntitySubTree entity="FeedbackItem" isCreating>
					<AlertDialog>
						<AlertDialogTrigger>
							<AnchorButton>alert Create Feedback</AnchorButton>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<FeedbackItemForm />
						</AlertDialogContent>
					</AlertDialog>
					<Dialog>
						<DialogTrigger>dialog Create Feedback</DialogTrigger>
						<DialogContent>
							<FeedbackItemForm />
						</DialogContent>
					</Dialog>
					<div>
						<FeedbackItemForm />
					</div>
				</EntitySubTree>
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
			</Binding>
		</>
	)
}

export const Create = () => {
	return (
		<>
			<Binding>
				<Slots.Title>Feedback create</Slots.Title>
				<Slots.Back>
					<BackButton />
				</Slots.Back>
				<EntitySubTree entity="FeedbackItem" isCreating>
					<RedirectOnPersist to="feedbackDetail(id: $entity.id)" />
					<FeedbackItemForm />
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

export const Edit = () => {
	return (
		<>
			<Binding>
				<Slots.Title>Feedback edit</Slots.Title>
				<Slots.Back>
					<BackButton />
				</Slots.Back>
				<EntitySubTree entity="FeedbackItem(id = $id)">
					<RedirectOnPersist to="feedbackDetail(id: $entity.id)" />
					<FeedbackItemForm />
				</EntitySubTree>
			</Binding>
		</>
	)
}
