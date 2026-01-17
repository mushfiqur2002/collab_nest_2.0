import React, { useState } from 'react';
import { Calendar, User, Users, Folder, AlertCircle, Clock, FileText } from 'lucide-react';
import { useUserContext } from '@/context/AuthContext';
import { useCreateTask, useGetMembers, useGetProjects, useGetUsers } from '@/lib/react-query/queryandmutation';
import { useAlert } from '@/context/AlertContext';

interface TaskFormData {
    taskName: string;
    taskDescription: string;
    dueDate: string;
    priority: string;
    status: string;
    taskOwner: string;
    taskWorker: string[];
    assignProjectId: string;
}

function ProjectTaskBoard() {
    const { user } = useUserContext();
    const { data: projects, isPending: isProjectLoading } = useGetProjects();
    const { data: members, isPending: isMembersLoading } = useGetMembers();
    const { data: users, isPending: isUsersLoading } = useGetUsers();
    const { mutateAsync: createTask, isPending: isCreatingTask } = useCreateTask();
    const { showError, showSuccess } = useAlert();

    // Filter user's projects
    const userProjects = projects?.documents?.filter(project =>
        project.elderID === user?.accountID ||
        project.members?.includes(user?.accountID)
    ) || [];

    // Filter user's members
    const userMembers = members?.documents?.filter(member =>
        member.elderID === user?.accountID ||
        member.members?.includes(user?.accountID)
    ) || [];

    // Get user info for members
    const userMembersInfo = users?.documents?.filter(u =>
        userMembers.some(member => member.applicantUserID === u.accountID)
    ) || [];

    const [formData, setFormData] = useState<TaskFormData>({
        taskName: '',
        taskDescription: '',
        dueDate: '',
        priority: 'medium',
        status: 'in-progress',
        taskOwner: user?.accountID || '',
        taskWorker: [],
        assignProjectId: ''
    });

    const priorities = [
        { value: 'low', label: 'Low', color: 'text-green-600' },
        { value: 'medium', label: 'Medium', color: 'text-yellow-600' },
        { value: 'high', label: 'High', color: 'text-orange-600' }
    ];

    const statuses = [
        { value: 'pending', label: 'Pending' },
        { value: 'in-progress', label: 'In Progress' },
        { value: 'review', label: 'Under Review' },
        { value: 'completed', label: 'Completed' },
        { value: 'blocked', label: 'Blocked' }
    ];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleWorkerToggle = (workerId: string) => {
        setFormData(prev => {
            const currentWorkers = [...prev.taskWorker];
            const index = currentWorkers.indexOf(workerId);

            if (index === -1) {
                return { ...prev, taskWorker: [...currentWorkers, workerId] };
            } else {
                currentWorkers.splice(index, 1);
                return { ...prev, taskWorker: currentWorkers };
            }
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Form validation
        if (!formData.assignProjectId) {
            alert('Please select a project');
            return;
        }

        if (!formData.taskName.trim()) {
            alert('Task name is required');
            return;
        }

        if (!formData.dueDate) {
            alert('Due date is required');
            return;
        }

        try {
            // Create task object
            const newTask = {
                taskName: formData.taskName.trim(),
                taskDescription: formData.taskDescription.trim(),
                dueDate: formData.dueDate,
                priority: formData.priority,
                status: formData.status,
                taskOwner: user?.accountID || '',
                taskWorker: formData.taskWorker,
                assignProjectId: formData.assignProjectId
            };

            // Send to API
            const createdTask = await createTask(newTask);

            console.log('Task created successfully:', createdTask);

            // Show success message
            showSuccess('Task created successfully!');

            // Reset form
            setFormData({
                taskName: '',
                taskDescription: '',
                dueDate: '',
                priority: 'medium',
                status: 'in-progress',
                taskOwner: user?.accountID || '',
                taskWorker: [],
                assignProjectId: ''
            });

        } catch (error) {
            console.error('Error creating task:', error);
            showError('Failed to create task. Please try again.');
        }
    };

    // Loading states
    const isLoading = isProjectLoading || isMembersLoading || isUsersLoading || isCreatingTask;

    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-700 rounded w-1/3 mb-4"></div>
                    <div className="h-4 bg-gray-700 rounded w-1/2 mb-8"></div>
                    <div className="bg-[#191919] rounded-xl p-6 space-y-6">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-12 bg-gray-700 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-100">Create New Task</h1>
                <p className="mt-2 text-gray-400">Fill in the details below to create a new task</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-[#191919] rounded-xl shadow-lg p-6 space-y-6">
                {/* Task Name (Required) */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Task Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="taskName"
                        value={formData.taskName}
                        onChange={handleChange}
                        maxLength={255}
                        required
                        disabled={isCreatingTask}
                        className="w-full px-4 py-3 border rounded-lg bg-[#2B2A2A] text-gray-100 border-none outline-none disabled:opacity-50"
                        placeholder="Enter task name"
                    />
                    <p className="text-xs text-gray-500 mt-1">Max 255 characters ({formData.taskName.length}/255)</p>
                </div>

                {/* Task Description */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        <FileText className="inline h-4 w-4 mr-1" />
                        Task Description
                    </label>
                    <textarea
                        name="taskDescription"
                        value={formData.taskDescription}
                        onChange={handleChange}
                        maxLength={500}
                        rows={4}
                        disabled={isCreatingTask}
                        className="w-full px-4 py-3 border rounded-lg bg-[#2B2A2A] text-gray-100 border-none outline-none disabled:opacity-50"
                        placeholder="Describe the task in detail..."
                    />
                    <p className="text-xs text-gray-500 mt-1">Max 500 characters ({formData.taskDescription.length}/500)</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Due Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            <Calendar className="inline h-4 w-4 mr-1" />
                            Due Date <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="datetime-local"
                            name="dueDate"
                            value={formData.dueDate}
                            onChange={handleChange}
                            required
                            disabled={isCreatingTask}
                            className="w-full px-4 py-3 border rounded-lg bg-[#2B2A2A] text-gray-100 border-none outline-none disabled:opacity-50"
                        />
                    </div>

                    {/* Priority */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            <AlertCircle className="inline h-4 w-4 mr-1" />
                            Priority
                        </label>
                        <select
                            name="priority"
                            value={formData.priority}
                            onChange={handleChange}
                            disabled={isCreatingTask}
                            className="w-full px-4 py-3 border rounded-lg bg-[#2B2A2A] text-gray-100 border-none outline-none disabled:opacity-50"
                        >
                            {priorities.map(priority => (
                                <option key={priority.value} value={priority.value}>
                                    {priority.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Status */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            <Clock className="inline h-4 w-4 mr-1" />
                            Status
                        </label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            disabled={isCreatingTask}
                            className="w-full px-4 py-3 border rounded-lg bg-[#2B2A2A] text-gray-100 border-none outline-none disabled:opacity-50"
                        >
                            {statuses.map(status => (
                                <option key={status.value} value={status.value}>
                                    {status.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Task Owner (Read-only) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            <User className="inline h-4 w-4 mr-1" />
                            Task Owner
                        </label>
                        <input
                            type="text"
                            value={user?.username}
                            readOnly
                            className="w-full px-4 py-3 border rounded-lg bg-[#2B2A2A] text-gray-400 border-none outline-none"
                        />
                        <input
                            type="hidden"
                            name="taskOwner"
                            value={user?.accountID || ''}
                        />
                    </div>
                </div>

                {/* Task Workers (Multiple Selection) */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        <Users className="inline h-4 w-4 mr-1" />
                        Assign Task Workers
                    </label>
                    {userMembersInfo.length === 0 ? (
                        <div className="text-center py-4 border-2 border-dashed border-gray-700 rounded-lg">
                            <p className="text-gray-400">No team members available</p>
                            <p className="text-sm text-gray-500 mt-1">Add members to your projects first</p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                                {userMembersInfo.map(member => (
                                    <div
                                        key={member.accountID}
                                        className={`border rounded-lg p-3 cursor-pointer transition-all ${formData.taskWorker.includes(member.accountID)
                                            ? 'border-blue-900 bg-[#2B2A2A]'
                                            : 'border-gray-300 hover:border-gray-400'
                                            }`}
                                        onClick={() => !isCreatingTask && handleWorkerToggle(member.accountID)}
                                    >
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={formData.taskWorker.includes(member.accountID)}
                                                onChange={() => !isCreatingTask && handleWorkerToggle(member.accountID)}
                                                disabled={isCreatingTask}
                                                className="h-4 w-4 rounded text-blue-600"
                                            />
                                            <div className="ml-2">
                                                <span className="text-sm text-gray-100 block capitalize">
                                                    {member.username || member.name || member.email}
                                                </span>
                                                <span className="text-xs text-gray-500 block">
                                                    {member.role || 'Member'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                                Selected: {formData.taskWorker.length} workers
                                {formData.taskWorker.length > 0 && (
                                    <span className="ml-2 text-blue-300">
                                        {formData.taskWorker.map(id =>
                                            userMembersInfo.find(u => u.accountID === id)?.username ||
                                            userMembersInfo.find(u => u.accountID === id)?.name ||
                                            'Unknown'
                                        ).join(', ')}
                                    </span>
                                )}
                            </p>
                        </>
                    )}
                </div>

                {/* Assign Project */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        <Folder className="inline h-4 w-4 mr-1" />
                        Assign to Project <span className="text-red-500">*</span>
                    </label>
                    {userProjects.length === 0 ? (
                        <div className="text-center py-4 border-2 border-dashed border-gray-700 rounded-lg">
                            <p className="text-gray-400">No projects available</p>
                            <p className="text-sm text-gray-500 mt-1">You need to create or join a project first</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                            {userProjects.map(project => (
                                <div
                                    key={project.$id}
                                    className={`border rounded-lg p-4 cursor-pointer transition-all ${formData.assignProjectId === project.$id
                                        ? 'border-blue-900 bg-[#2B2A2A] ring-2 ring-blue-500/30'
                                        : 'border-gray-300 hover:border-gray-400 hover:bg-gray-800'
                                        }`}
                                    onClick={() => !isCreatingTask && setFormData(prev => ({
                                        ...prev,
                                        assignProjectId: project.$id
                                    }))}
                                >
                                    <div className="flex items-center">
                                        <div className={`h-3 w-3 rounded-full mr-3 ${formData.assignProjectId === project.$id ? 'bg-blue-500' : 'bg-gray-300'
                                            }`} />
                                        <span className="font-medium text-gray-100 capitalize">
                                            {project.projectName}
                                        </span>
                                    </div>
                                    {project.projectDescription && (
                                        <p className="text-xs text-gray-400 mt-2 truncate">
                                            {project.projectDescription}
                                        </p>
                                    )}
                                    <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                                        <span>
                                            {project.elderID === user?.accountID ? 'Owner' : 'Member'}
                                        </span>
                                        <span>
                                            {new Date(project.$createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    {!formData.assignProjectId && userProjects.length > 0 && (
                        <p className="text-sm text-red-400 mt-2">Please select a project</p>
                    )}
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-700">
                    <button
                        type="button"
                        onClick={() => {
                            if (!isCreatingTask) {
                                setFormData({
                                    taskName: '',
                                    taskDescription: '',
                                    dueDate: '',
                                    priority: 'medium',
                                    status: 'in-progress',
                                    taskOwner: user?.accountID || '',
                                    taskWorker: [],
                                    assignProjectId: ''
                                });
                            }
                        }}
                        disabled={isCreatingTask}
                        className="px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
                    >
                        Clear Form
                    </button>
                    <button
                        type="submit"
                        disabled={isCreatingTask || !formData.assignProjectId}
                        className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isCreatingTask ? 'Creating Task...' : 'Create Task'}
                    </button>
                </div>

                {/* Debug Info (optional) */}
                <div className="mt-6 pt-6 border-t border-gray-700">
                    <details className="text-sm">
                        <summary className="cursor-pointer text-gray-400 hover:text-gray-300">
                            Debug Form Data
                        </summary>
                        <pre className="mt-2 p-4 bg-[#2B2A2A] rounded-lg overflow-auto text-xs">
                            {JSON.stringify(formData, null, 2)}
                        </pre>
                    </details>
                </div>
            </form>
        </div>
    );
}

export default ProjectTaskBoard;