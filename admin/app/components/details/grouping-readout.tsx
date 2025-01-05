import { Component, Field } from '@contember/interface'
import { Table, TableBody, TableCell, TableRow, TableWrapper } from '~/lib/ui/table'

export const GroupingReadout = Component(() => <TableWrapper className="bg-gray-50/50 max-w-lg border rounded-md">
	<Table>
		<TableBody>
			<TableRow>
				<TableCell>
					Name
				</TableCell>
				<TableCell className="font-semibold">
					<Field field="name" />
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
					Project name
				</TableCell>
				<TableCell className="font-semibold">
					<Field field="project.name" />
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
