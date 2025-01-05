import { Component, Field } from '@contember/interface'
import { Table, TableBody, TableCell, TableRow, TableWrapper } from '~/lib/ui/table'

export const CommentReadout = Component(() => (
	<TableWrapper className="bg-gray-50/50 max-w-lg border rounded-md">
		<Table>
			<TableBody>
				<TableRow>
					<TableCell>Content</TableCell>
					<TableCell className="font-semibold">
						<Field field="content" />
					</TableCell>
				</TableRow>
				<TableRow>
					<TableCell>Date</TableCell>
					<TableCell className="font-semibold">
						<Field field="date" />
					</TableCell>
				</TableRow>
				<TableRow>
					<TableCell>User name</TableCell>
					<TableCell className="font-semibold">
						<Field field="user.name" />
					</TableCell>
				</TableRow>
				<TableRow>
					<TableCell>Created at</TableCell>
					<TableCell className="font-semibold">
						<Field field="createdAt" />
					</TableCell>
				</TableRow>
			</TableBody>
		</Table>
	</TableWrapper>
))
