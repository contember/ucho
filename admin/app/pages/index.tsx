import { useEffect } from 'react'
import { useProjectUserRoles, useRedirect } from '@contember/interface'

export default () => {
	const redirect = useRedirect()
	const roles = useProjectUserRoles()

	useEffect(() => {
		}, [redirect])

	return null
}
