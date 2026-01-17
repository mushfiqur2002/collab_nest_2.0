import { useState } from 'react';
import {
    ClipboardList,
    CheckCircle,
    AlertTriangle,
    List,
    SquareChartGantt,
    Clock,
    Eye,
    AlertCircle,
    Check,
    ChevronDown,
    Calendar,
    FileText,
    Folder,
    MoreVertical
} from 'lucide-react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { format } from 'date-fns';
import { useUserContext } from '@/context/AuthContext';
import { useGetProjects, useGetTasks, useUpdateTask } from '@/lib/react-query/queryandmutation';
import { useAlert } from '@/context/AlertContext';

// Create a reusable StatusUpdateModal component
interface StatusUpdateModalProps {
    task: TaskType;
    isOpen: boolean;
    onClose: () => void;
    onStatusUpdate: (taskId: string, newStatus: string) => void;
}
const StatusUpdateModal = ({ task, isOpen, onClose, onStatusUpdate }: StatusUpdateModalProps) => {
    const [selectedStatus, setSelectedStatus] = useState(task.status || 'pending');

    const statusOptions = [
        { value: 'in-progress', label: 'In Progress', icon: Clock, color: 'text-blue-500' },
        { value: 'review', label: 'Under Review', icon: Eye, color: 'text-purple-500' },
        { value: 'completed', label: 'Completed', icon: Check, color: 'text-green-500' },
    ];

    const handleSubmit = () => {
        onStatusUpdate(task.$id, selectedStatus);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-dark-3 rounded-lg p-6 w-full max-w-md">
                <h3 className="text-lg font-bold text-gray-100 mb-4">Update Task Status</h3>

                <div className="mb-4">
                    <p className="block text-sm font-medium text-gray-300 mb-2">Task: <span className="text-gray-100">{task.taskName}</span></p>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Select New Status
                    </label>
                    <div className="space-y-2">
                        {statusOptions.map((status) => {
                            const Icon = status.icon;
                            return (
                                <label
                                    key={status.value}
                                    className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${selectedStatus === status.value
                                        ? 'bg-dark-4 border border-blue-500'
                                        : 'bg-dark-4/50 hover:bg-dark-4'
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="status"
                                        value={status.value}
                                        checked={selectedStatus === status.value}
                                        onChange={(e) => setSelectedStatus(e.target.value)}
                                        className="h-4 w-4 text-blue-600 mr-3"
                                    />
                                    <Icon className={`h-4 w-4 mr-2 ${status.color}`} />
                                    <span className="text-gray-100">{status.label}</span>
                                </label>
                            );
                        })}
                    </div>
                </div>

                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Update Status
                    </button>
                </div>
            </div>
        </div>
    );
};

// Create a StatusDropdown component for inline updates
type TaskType = {
    $id: string;
    status?: string;
    taskName?: string;
    taskDescription?: string;
    assignProjectId?: string;
    taskOwner?: string;
    taskWorker?: string[];
    dueDate?: string;
    priority?: string;
    [key: string]: any;
};

// interface StatusDropdownProps {
//     task: TaskType;
//     onStatusUpdate: (taskId: string, newStatus: string) => void;
// }

// const StatusDropdown = ({ task, onStatusUpdate }: StatusDropdownProps) => {
//     const [isOpen, setIsOpen] = useState(false);

//     const statusOptions = [
//         { value: 'in-progress', label: 'In Progress', icon: Clock, color: 'text-blue-500', bg: 'bg-blue-900/30' },
//         { value: 'review', label: 'Under Review', icon: Eye, color: 'text-purple-500', bg: 'bg-purple-900/30' },
//         { value: 'completed', label: 'Completed', icon: Check, color: 'text-green-500', bg: 'bg-green-900/30' }
//     ];

//     const currentStatus = statusOptions.find(s => s.value === (task.status || 'pending')) || statusOptions[0];

//     const handleStatusChange = (status: any) => {
//         setIsOpen(false);
//         onStatusUpdate(task.$id, status);
//     };

//     return (
//         <div className="relative">
//             <button
//                 className={`px-3 py-1 rounded-full text-xs font-medium inline-flex items-center ${currentStatus.bg} ${currentStatus.color} hover:opacity-80`}
//                 onClick={(e) => {
//                     e.stopPropagation();
//                     setIsOpen(!isOpen);
//                 }}
//             >
//                 {currentStatus.icon && <currentStatus.icon className="h-3 w-3 mr-1" />}
//                 {currentStatus.label}
//                 <ChevronDown className="h-3 w-3 ml-1" />
//             </button>

//             {isOpen && (
//                 <div
//                     className="absolute z-20 mt-1 w-48 bg-dark-3 border border-dark-4 rounded-lg shadow-lg"
//                     onClick={(e) => e.stopPropagation()}
//                 >
//                     <div className="py-1">
//                         {statusOptions.map((status) => {
//                             const Icon = status.icon;
//                             return (
//                                 <button
//                                     key={status.value}
//                                     className={`w-full flex items-center px-4 py-2 text-sm hover:bg-dark-4 ${task.status === status.value ? status.color : 'text-gray-300'
//                                         }`}
//                                     onClick={() => handleStatusChange(status.value)}
//                                 >
//                                     <Icon className={`h-4 w-4 mr-3 ${status.color}`} />
//                                     {status.label}
//                                     {task.status === status.value && (
//                                         <Check className="h-4 w-4 ml-auto" />
//                                     )}
//                                 </button>
//                             );
//                         })}
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

function AdminProjectView() {
    const { user } = useUserContext();
    const { data: projects, isLoading: isLoadingProjects } = useGetProjects();
    const { data: tasks, isLoading: isLoadingTasks } = useGetTasks();
    const { mutate: updateTask } = useUpdateTask();
    const { showSuccess } = useAlert()

    // State for status update modal
    const [selectedTask, setSelectedTask] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Filter projects to show only current user's projects
    const userProjects = projects?.documents?.filter(project =>
        project.elderID === user?.accountID ||
        project.members?.includes(user?.accountID)
    ) || [];

    // Filter tasks for current user (owner or assigned worker)
    const userTasks = tasks?.documents?.filter(task =>
        task.taskOwner === user?.accountID ||
        task.taskWorker?.includes(user?.accountID)
    ) || [];

    // Calculate statistics for cards
    const totalProjects = userProjects.length;
    const totalTasks = userTasks.length;
    const submittedTasks = userTasks.filter(task => task.status === 'completed').length;
    const overdueTasks = userTasks.filter(task => {
        if (!task.dueDate) return false;
        try {
            return new Date(task.dueDate) < new Date() && task.status !== 'completed';
        } catch {
            return false;
        }
    }).length;

    // Get task counts for each project
    const getTaskCount = (projectId: string) => {
        if (!tasks?.documents) return 0;
        return tasks.documents.filter(task =>
            task.assignProjectId === projectId
        ).length;
    };

    // Get member count for each project
    const getMemberCount = (project: any) => {
        let count = 0;
        if (Array.isArray(project.members)) {
            count += project.members.length;
        }
        return count;
    };

    // Get project name by ID
    const getProjectName = (projectId: string) => {
        const project = projects?.documents?.find(p => p.$id === projectId);
        return project?.projectName || 'Unknown Project';
    };

    // Date formatting helper
    const formatDate = (dateString: string) => {
        try {
            return format(new Date(dateString), 'MMM dd, yyyy');
        } catch {
            return 'N/A';
        }
    };

    // Get priority badge styling
    const getPriorityBadge = (priority: string) => {
        switch (priority?.toLowerCase()) {
            case 'high':
                return {
                    bg: 'bg-red-900/30',
                    text: 'text-red-300',
                    icon: <AlertTriangle className="h-3 w-3 mr-1" />,
                    label: 'High'
                };
            case 'medium':
                return {
                    bg: 'bg-yellow-900/30',
                    text: 'text-yellow-300',
                    icon: <AlertCircle className="h-3 w-3 mr-1" />,
                    label: 'Medium'
                };
            case 'low':
                return {
                    bg: 'bg-green-900/30',
                    text: 'text-green-300',
                    icon: <AlertCircle className="h-3 w-3 mr-1" />,
                    label: 'Low'
                };
            default:
                return {
                    bg: 'bg-gray-900/30',
                    text: 'text-gray-300',
                    icon: <AlertCircle className="h-3 w-3 mr-1" />,
                    label: priority || 'Unknown'
                };
        }
    };


    const getTaskBadge = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'completed':
                return {
                    bg: 'bg-green-900/30',
                    text: 'text-green-300',
                    icon: <CheckCircle className="h-3 w-3 mr-1" />,
                    label: 'Completed'
                };
            case 'in-progress':
                return {
                    bg: 'bg-blue-900/30',
                    text: 'text-blue-300',
                    icon: <Clock className="h-3 w-3 mr-1" />,
                    label: 'In Progress'
                };
            case 'review':
                return {
                    bg: 'bg-purple-900/30',
                    text: 'text-purple-300',
                    icon: <Eye className="h-3 w-3 mr-1" />,
                    label: 'Under Review'
                };
            default:
                return {
                    bg: 'bg-gray-900/30',
                    text: 'text-gray-300',
                    icon: <Clock className="h-3 w-3 mr-1" />,
                    label: status || 'Unknown'
                };
        }
    };

    // Handle status update
    const handleStatusUpdate = (taskId: string, newStatus: string) => {
        console.log(`Updating task ${taskId} to status: ${newStatus}`);
        // Call your API mutation here
        updateTask({ taskId, status: newStatus });
        console.log(tasks);

        // For demo, show success message
        showSuccess(`Task status updated to: ${newStatus}`);
    };

    // Open edit modal
    const openEditModal = (task: any) => {
        setSelectedTask(task);
        setIsModalOpen(true);
    };

    // Check if due date is overdue
    const isOverdue = (dueDate: string) => {
        if (!dueDate) return false;
        try {
            return new Date(dueDate) < new Date();
        } catch {
            return false;
        }
    };

    const isLoading = isLoadingProjects || isLoadingTasks;

    if (isLoading) {
        return (
            <div className='flex flex-col gap-3 p-4'>
                <div className="task-card py-2 flex flex-wrap gap-4 animate-pulse">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="w-[150px] md:w-[156px] h-[100px] bg-dark-4 rounded-xl"></div>
                    ))}
                </div>
                <div className='project-table bg-dark-3 rounded-lg p-4 animate-pulse'>
                    <div className="h-8 bg-dark-4 rounded w-48 mb-4"></div>
                    <div className="h-64 bg-dark-4 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className='flex flex-col gap-3'>
            {/* Status Update Modal */}
            {selectedTask && (
                <StatusUpdateModal
                    task={selectedTask}
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setSelectedTask(null);
                    }}
                    onStatusUpdate={handleStatusUpdate}
                />
            )}

            {/* Statistics Cards */}
            <div className="task-card py-2 flex flex-wrap gap-4">
                {/* Total Projects */}
                <div className="w-[150px] md:w-[156px] h-[100px] bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex md:flex-col gap-1 md:gap-0 items-center justify-center text-white shadow-lg hover:shadow-xl transition-all cursor-pointer hover:scale-105">
                    <div className="flex items-center justify-center w-10 h-10 bg-white/20 rounded-full">
                        <ClipboardList className="h-5 w-5" />
                    </div>
                    <div className='flex flex-col md:items-center md:gap-1'>
                        <p className="capitalize text-sm font-medium">Total Projects</p>
                        <p className="text-2xl font-bold">{totalProjects}</p>
                    </div>
                </div>

                {/* Total Tasks */}
                <div className="w-[150px] md:w-[156px] h-[100px] bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex md:flex-col gap-1 md:gap-0 items-center justify-center text-white shadow-lg hover:shadow-xl transition-all cursor-pointer hover:scale-105">
                    <div className="flex items-center justify-center w-10 h-10 bg-white/20 rounded-full">
                        <List className="h-5 w-5" />
                    </div>
                    <div className='flex flex-col md:items-center md:gap-1'>
                        <p className="capitalize text-sm font-medium">Total Tasks</p>
                        <p className="text-2xl font-bold">{totalTasks}</p>
                    </div>
                </div>

                {/* Completed Tasks */}
                <div className="w-[150px] md:w-[156px] h-[100px] bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex md:flex-col gap-1 md:gap-0 items-center justify-center text-white shadow-lg hover:shadow-xl transition-all cursor-pointer hover:scale-105">
                    <div className="flex items-center justify-center w-10 h-10 bg-white/20 rounded-full">
                        <CheckCircle className="h-5 w-5" />
                    </div>
                    <div className='flex flex-col md:items-center md:gap-1'>
                        <p className="capitalize text-sm font-medium">Completed</p>
                        <p className="text-2xl font-bold">{submittedTasks}</p>
                    </div>
                </div>

                {/* Overdue Tasks */}
                <div className="w-[150px] md:w-[156px] h-[100px] bg-gradient-to-br from-rose-500 to-rose-600 rounded-xl flex md:flex-col gap-1 md:gap-0 items-center justify-center text-white shadow-lg hover:shadow-xl transition-all cursor-pointer hover:scale-105">
                    <div className="flex items-center justify-center w-10 h-10 bg-white/20 rounded-full">
                        <AlertTriangle className="h-5 w-5" />
                    </div>
                    <div className='flex flex-col md:items-center md:gap-1'>
                        <p className="capitalize text-sm font-medium">Overdue</p>
                        <p className="text-2xl font-bold">{overdueTasks}</p>
                    </div>
                </div>
            </div>

            {/* Project Table */}
            <div className='project-table'>
                <div className='header mb-4'>
                    <span className="text-xl font-semibold py-2 flex flex-start gap-1">
                        <SquareChartGantt />
                        <p className="text-2xl capitalize">project table</p>
                    </span>
                </div>
                <div className='table'>
                    <Table className='bg-dark-3 w-full'>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-gray-300">Project Name</TableHead>
                                <TableHead className="text-gray-300">Tasks</TableHead>
                                <TableHead className="text-gray-300">Members</TableHead>
                                <TableHead className="text-gray-300">Created At</TableHead>
                            </TableRow>
                        </TableHeader>
                        {userProjects.length === 0 ? (
                            <TableBody>
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-8">
                                        <Folder className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                                        <h3 className="text-lg font-medium text-gray-300 mb-2">No Projects Found</h3>
                                        <p className="text-gray-500">You don't have any projects yet. Create one to get started!</p>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        ) : (
                            <TableBody>
                                {userProjects.map((project) => {
                                    const isOwner = project.elderID === user?.accountID;
                                    const taskCount = getTaskCount(project.$id);
                                    const memberCount = getMemberCount(project);

                                    return (
                                        <TableRow
                                            key={project.$id}
                                            className="hover:bg-dark-4 border-b border-dark-4 cursor-pointer"
                                        >
                                            <TableCell className="py-4">
                                                <div className="flex items-center">
                                                    <div className={`h-3 w-3 rounded-full mr-3 ${isOwner ? 'bg-blue-500' : 'bg-green-500'}`} />
                                                    <div>
                                                        <div className="font-medium text-gray-100 capitalize">
                                                            {project.projectName}
                                                        </div>
                                                        {project.projectDescription && (
                                                            <div className="text-sm text-gray-400 truncate max-w-xs">
                                                                {project.projectDescription}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </TableCell>

                                            <TableCell>
                                                <div className="flex items-center">
                                                    <span className="font-medium text-gray-100">{taskCount}</span>
                                                </div>
                                            </TableCell>

                                            <TableCell>
                                                <div className="flex items-center">
                                                    <span className="font-medium text-gray-100">{memberCount}</span>
                                                </div>
                                            </TableCell>

                                            <TableCell>
                                                <div className="flex items-center">
                                                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                                                    <span className="text-gray-300">
                                                        {formatDate(project.$createdAt || project.createdAt)}
                                                    </span>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        )}
                    </Table>
                </div>
            </div>

            {/* Task Table */}
            <div className='tasks-table mt-4'>
                <div className='header mb-4'>
                    <span className="text-xl font-semibold py-2 flex flex-start gap-1">
                        <SquareChartGantt />
                        <p className="text-2xl capitalize">tasks table</p>
                    </span>
                </div>
                <div className='table'>
                    <Table className='bg-dark-3 w-full'>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-gray-300">Task Name</TableHead>
                                <TableHead className="text-gray-300">Project</TableHead>
                                <TableHead className="text-gray-300">Assigned To</TableHead>
                                <TableHead className="text-gray-300">Due Date</TableHead>
                                <TableHead className="text-gray-300">Status</TableHead>
                                <TableHead className="text-gray-300">Priority</TableHead>
                                <TableHead className="text-gray-300">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        {userTasks.length === 0 ? (
                            <TableBody>
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-8">
                                        <FileText className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                                        <h3 className="text-lg font-medium text-gray-300 mb-2">No Tasks Found</h3>
                                        <p className="text-gray-500">You don't have any tasks yet.</p>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        ) : (
                            <TableBody>
                                {userTasks.map((task) => {
                                    const priorityBadge = getPriorityBadge(task.priority);
                                    const taskBadge = getTaskBadge(task.status);
                                    const isTaskOverdue = isOverdue(task.dueDate);

                                    return (
                                        <TableRow
                                            key={task.$id}
                                            className={`hover:bg-dark-4 border-b border-dark-4 ${isTaskOverdue ? 'bg-red-900/10' : ''}`}
                                        >
                                            {/* Task Name */}
                                            <TableCell className="py-4">
                                                <div className="flex flex-col">
                                                    <div className="font-medium text-gray-100 truncate max-w-xs">
                                                        {task.taskName}
                                                    </div>
                                                    {task.taskDescription && (
                                                        <div className="text-sm text-gray-400 truncate max-w-xs">
                                                            {task.taskDescription}
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>

                                            {/* Project */}
                                            <TableCell>
                                                <div className="text-gray-300 capitalize">
                                                    {getProjectName(task.assignProjectId)}
                                                </div>
                                            </TableCell>

                                            {/* Assigned To */}
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    {task.taskWorker && task.taskWorker.length > 0 && (
                                                        <div className="text-gray-100 font-medium">
                                                            {task.taskWorker.length}
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>

                                            {/* Due Date */}
                                            <TableCell>
                                                <div className="flex items-center">
                                                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                                                    <div>
                                                        <div className={`font-medium ${isTaskOverdue ? 'text-red-400' : 'text-gray-300'}`}>
                                                            {formatDate(task.dueDate)}
                                                        </div>
                                                        {isTaskOverdue && (
                                                            <div className="text-xs text-red-400">Overdue</div>
                                                        )}
                                                    </div>
                                                </div>
                                            </TableCell>

                                            {/* Status (with dropdown) */}
                                            <TableCell>
                                                {/* <StatusDropdown
                                                    task={task}
                                                    onStatusUpdate={handleStatusUpdate}
                                                /> */}

                                                <div className={`px-3 py-1 rounded-full text-xs font-medium inline-flex items-center ${taskBadge.bg} ${taskBadge.text}`}>
                                                    {taskBadge.icon}
                                                    {taskBadge.label}
                                                </div>
                                            </TableCell>

                                            {/* Priority */}
                                            <TableCell>
                                                <div className={`px-3 py-1 rounded-full text-xs font-medium inline-flex items-center ${priorityBadge.bg} ${priorityBadge.text}`}>
                                                    {priorityBadge.icon}
                                                    {priorityBadge.label}
                                                </div>
                                            </TableCell>

                                            {/* Actions */}
                                            <TableCell>
                                                <div className="flex space-x-2">
                                                    <button
                                                        className="p-2 text-gray-400 hover:text-blue-400 hover:bg-dark-4 rounded-lg"
                                                        title="View Task"
                                                        onClick={() => {
                                                            // Navigate to task details
                                                            // navigate(`/tasks/${task.$id}`);
                                                        }}
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </button>

                                                    <button
                                                        className="p-2 text-gray-400 hover:text-yellow-400 hover:bg-dark-4 rounded-lg"
                                                        title="Update Status"
                                                        onClick={() => openEditModal(task)}
                                                    >
                                                        <MoreVertical className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        )}
                    </Table>
                </div>
            </div>
        </div>
    )
}

export default AdminProjectView