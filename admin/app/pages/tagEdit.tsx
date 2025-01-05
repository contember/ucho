import { EntitySubTree, RedirectOnPersist } from '@contember/interface'
import { TagForm } from '~/app/components/forms/tag-form'
import { Binding } from '~/lib/binding'
import { BackButton } from '~/lib/buttons'
import { Slots } from '~/lib/layout'

export default () => {
	return (
		<>
			<Binding>
				<Slots.Title>Tag edit</Slots.Title>
				<Slots.Back>
					<BackButton />
				</Slots.Back>
				<EntitySubTree entity="Tag(id = $id)">
					<RedirectOnPersist to="tagDetail(id: $entity.id)" />
					<TagForm />
				</EntitySubTree>
			</Binding>
		</>
	)
}
