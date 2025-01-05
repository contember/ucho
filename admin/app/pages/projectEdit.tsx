import { EntitySubTree, RedirectOnPersist } from '@contember/interface'
import { ProjectForm } from '~/app/components/forms/project-form'
import { Binding } from '~/lib/binding'
import { BackButton } from '~/lib/buttons'
import { Slots } from '~/lib/layout'

export default () => {
	return (
		<>
			<Binding>
				<Slots.Title>
					Project edit
				</Slots.Title>
				<Slots.Back>
					<BackButton />
				</Slots.Back>
				<EntitySubTree entity="Project(id = $id)">
					<RedirectOnPersist to="projectDetail(id: $entity.id)" />
					<ProjectForm />
				</EntitySubTree>
			</Binding>
		</>
	)
}
