import {
    House, Users, FileUser, SquarePen, FolderGit2, CheckSquare, MessagesSquare, Video, PenTool
} from 'lucide-react';
export const navLinks = [
    {
        label: 'home',
        icon: House,
        path: '/'
    },
    {
        label: 'people',
        icon: Users,
        path: '/all-users'
    },
    {
        label: 'applications',
        icon: FileUser,
        path: '/application'
    },
    {
        label: 'create post',
        icon: SquarePen,
        path: '/create-post'
    },
    {
        label: 'project',
        icon: FolderGit2,
        path: '/project'
    },
]

export const bottomBarLinks = [
    {
        label: 'home',
        icon: House,
        path: '/'
    },
    {
        label: 'people',
        icon: Users,
        path: '/all-users'
    },
    {
        label: 'applications',
        icon: FileUser,
        path: '/application'
    },
    {
        label: 'create post',
        icon: SquarePen,
        path: '/create-post'
    },
    {
        label: 'project',
        icon: FolderGit2,
        path: '/project'
    },
]

export const projectDashBoardNavLink = [
    {
        label: "Home",
        icon: House,
        path: "home",
    },
    {
        label: "Tasks",
        icon: CheckSquare,
        path: "tasks",
    },
    {
        label: "Chat",
        icon: MessagesSquare,
        path: "chat",
    },
    {
        label: "Meetings",
        icon: Video,
        path: "meetings",
    },
    {
        label: "Whiteboard",
        icon: PenTool,
        path: "whiteboard",
    },
];
