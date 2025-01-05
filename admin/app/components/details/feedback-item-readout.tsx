import { Component, Field } from '@contember/interface'
import { Table, TableBody, TableCell, TableRow, TableWrapper } from '~/lib/ui/table'

export const FeedbackItemReadout = Component(() => <TableWrapper className="bg-gray-50/50 max-w-lg border rounded-md">
	<Table>
		<TableBody>
			<TableRow>
				<TableCell>
					Title
				</TableCell>
				<TableCell className="font-semibold">
					<Field field="title" />
				</TableCell>
			</TableRow>
			<TableRow>
				<TableCell>
					Description
				</TableCell>
				<TableCell className="font-semibold">
					<Field field="description" />
				</TableCell>
			</TableRow>
			<TableRow>
				<TableCell>
					Attachments
				</TableCell>
				<TableCell className="font-semibold">
					<Field field="attachments" />
				</TableCell>
			</TableRow>
			<TableRow>
				<TableCell>
					Status
				</TableCell>
				<TableCell className="font-semibold">
					<Field field="status" />
				</TableCell>
			</TableRow>
			<TableRow>
				<TableCell>
					Priority
				</TableCell>
				<TableCell className="font-semibold">
					<Field field="priority" />
				</TableCell>
			</TableRow>
			<TableRow>
				<TableCell>
					Date
				</TableCell>
				<TableCell className="font-semibold">
					<Field field="date" />
				</TableCell>
			</TableRow>
			<TableRow>
				<TableCell>
					Project name
				</TableCell>
				<TableCell className="font-semibold">
					<Field field="project.name" />
				</TableCell>
			</TableRow>
			<TableRow>
				<TableCell>
					Group name
				</TableCell>
				<TableCell className="font-semibold">
					<Field field="group.name" />
				</TableCell>
			</TableRow>
			<TableRow>
				<TableCell>
					Reporter name
				</TableCell>
				<TableCell className="font-semibold">
					<Field field="reporter.name" />
				</TableCell>
			</TableRow>
			<TableRow>
				<TableCell>
					Created at
				</TableCell>
				<TableCell className="font-semibold">
					<Field field="createdAt" />
				</TableCell>
			</TableRow>
		</TableBody>
	</Table>
</TableWrapper>)
