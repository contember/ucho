import { EntitySubTree, RedirectOnPersist } from '@contember/interface'
import { GroupingForm } from '~/app/components/forms/grouping-form'
import { Binding } from '~/lib/binding'
import { BackButton } from '~/lib/buttons'
import { Slots } from '~/lib/layout'

export default () => {
	return (
		<>
			<Binding>
				<Slots.Title>Grouping create</Slots.Title>
				<Slots.Back>
					<BackButton />
				</Slots.Back>
				<EntitySubTree entity="Grouping" isCreating>
					<RedirectOnPersist to="groupingDetail(id: $entity.id)" />
					<GroupingForm />
				</EntitySubTree>
			</Binding>
		</>
	)
}
