import { Component } from '@contember/interface'
import { FolderIcon, LayersIcon, LayoutDashboardIcon, MessageSquareIcon, TagIcon, UsersIcon } from 'lucide-react'
import { Menu, MenuItem } from '~/lib/ui/menu'

export const Navigation = Component(() => (
	<Menu>
		<MenuItem label="Projects" icon={<FolderIcon />} to="project/list" />
		<MenuItem label="Feedback" icon={<MessageSquareIcon />} to="feedback/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" />
		<MenuItem label="Groupings" icon={<LayersIcon />} to="grouping/list" />
		<MenuItem label="Users" icon={<UsersIcon />} to="user/list" />
		<MenuItem label="Tags" icon={<TagIcon />} to="tag/list" />
		<MenuItem label="Dashboard" icon={<LayoutDashboardIcon />} to="project/list" />
	</Menu>
))
