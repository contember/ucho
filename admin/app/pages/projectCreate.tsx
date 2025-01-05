import { EntitySubTree, RedirectOnPersist } from '@contember/interface'
import { ProjectForm } from '~/app/components/forms/project-form'
import { Binding } from '~/lib/binding'
import { BackButton } from '~/lib/buttons'
import { Slots } from '~/lib/layout'

export default () => {
	return (
		<>
			<Binding>
				<Slots.Title>Project create</Slots.Title>
				<Slots.Back>
					<BackButton />
				</Slots.Back>
				<EntitySubTree entity="Project" isCreating>
					<RedirectOnPersist to="projectDetail(id: $entity.id)" />
					<ProjectForm />
				</EntitySubTree>
			</Binding>
		</>
	)
}
