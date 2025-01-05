import { EntitySubTree, RedirectOnPersist } from '@contember/interface'
import { FeedbackItemForm } from '~/app/components/forms/feedback-item-form'
import { Binding } from '~/lib/binding'
import { BackButton } from '~/lib/buttons'
import { Slots } from '~/lib/layout'

export default () => {
	return (
		<>
			<Binding>
				<Slots.Title>
					Feedback edit
				</Slots.Title>
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
