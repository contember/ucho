import { EntitySubTree, Link } from '@contember/interface'
import { Binding } from '~/lib/binding'
import { BackButton } from '~/lib/buttons'
import { Slots } from '~/lib/layout'
import { AnchorButton } from '~/lib/ui/button'

export default () => {
	return (
		<>
			<Binding>
				<Slots.Actions>
					<Link to="groupingEdit(id: $entity.id)">
						<AnchorButton>
							Edit
						</AnchorButton>
					</Link>
				</Slots.Actions>
				<Slots.Title>
					Grouping detail
				</Slots.Title>
				<Slots.Back>
					<BackButton />
				</Slots.Back>
				<EntitySubTree entity="Grouping(id = $id)" />
			</Binding>
		</>
	)
}
