import { EntitySubTree, RedirectOnPersist } from '@contember/interface'
import { UserForm } from '~/app/components/forms/user-form'
import { Binding } from '~/lib/binding'
import { BackButton } from '~/lib/buttons'
import { Slots } from '~/lib/layout'

export default () => {
	return (
		<>
			<Binding>
				<Slots.Title>
					User create
				</Slots.Title>
				<Slots.Back>
					<BackButton />
				</Slots.Back>
				<EntitySubTree entity="User" isCreating>
					<RedirectOnPersist to="userDetail(id: $entity.id)" />
					<UserForm />
				</EntitySubTree>
			</Binding>
		</>
	)
}
