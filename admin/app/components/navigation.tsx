import { Component } from '@contember/interface'
import { Menu, MenuItem } from '~/lib/ui/menu'
import { FolderIcon, LayersIcon, LayoutDashboardIcon, MessageSquareIcon, TagIcon, UsersIcon } from 'lucide-react'

export const Navigation = Component(() => (
	<Menu>
		<MenuItem label="Projects" icon={<FolderIcon />} to="projectList" />
		<MenuItem label="Feedback" icon={<MessageSquareIcon />} to="feedbackList" />
		<MenuItem label="Groupings" icon={<LayersIcon />} to="groupingList" />
		<MenuItem label="Users" icon={<UsersIcon />} to="userList" />
		<MenuItem label="Tags" icon={<TagIcon />} to="tagList" />
		<MenuItem label="Dashboard" icon={<LayoutDashboardIcon />} to="projectList" />
	</Menu>
))
