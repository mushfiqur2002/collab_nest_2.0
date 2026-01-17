import React, { useState } from 'react';
import { Calendar, User, Users, Folder, AlertCircle, Clock, FileText } from 'lucide-react';
import { useUserContext } from '@/context/AuthContext';
import { useGetMembers, useGetProjects, useGetUsers } from '@/lib/react-query/queryandmutation';

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
    const { user } = useUserContext()
    const { data: projects, isPending: isProjectLoading } = useGetProjects()
    const { data: members, isPending: isMembersLoading } = useGetMembers();
    const { data: users, isPending: isUsersLoading } = useGetUsers();


    const userProjects = projects?.documents.filter(project =>
        project.elderID === user?.accountID ||
        project.members?.includes(user?.accountID)
    ) || [];

    const userMembers = members?.documents.filter(member =>
        member.elderID === user?.accountID ||
        member.members?.includes(user?.accountID)
    ) || [];

    const userMembersInfo = users?.documents.filter(u =>
        userMembers.some(member => member.applicantUserID === u.accountID)
    ) || [];

    console.log(userMembersInfo);





    const [formData, setFormData] = useState<TaskFormData>({
        taskName: '',
        taskDescription: '',
        dueDate: '',
        priority: 'medium',
        status: 'pending',
        taskOwner: '',
        taskWorker: [],
        assignProjectId: ''
    });

    const priorities = [
        { value: 'low', label: 'Low', color: 'text-green-600' },
        { value: 'medium', label: 'Medium', color: 'text-yellow-600' },
        { value: 'high', label: 'High', color: 'text-orange-600' }
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        // Add your form submission logic here
        alert('Task created successfully!');
    };
    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Create New Task</h1>
                <p className="mt-2">Fill in the details below to create a new task</p>
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
                        className="w-full px-4 py-3 border rounded-lg bg-[#2B2A2A] border-none outline-none"
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
                        className="w-full px-4 py-3 border rounded-lg bg-[#2B2A2A] border-none outline-none"
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
                            className="w-full px-4 py-3 border rounded-lg bg-[#2B2A2A] border-none outline-none"
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
                            className="w-full px-4 py-3 border rounded-lg bg-[#2B2A2A] border-none outline-none"
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
                        <input
                            name="status"
                            value={'In Progress'}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border rounded-lg bg-[#2B2A2A] border-none outline-none"
                            readOnly
                        />
                    </div>

                    {/* Task Owner */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            <User className="inline h-4 w-4 mr-1" />
                            Task Owner
                        </label>
                        <input
                            type="text"
                            name="taskOwner"
                            value={user.accountID}
                            onChange={handleChange}
                            maxLength={2000}
                            className="w-full px-4 py-3 border rounded-lg bg-[#2B2A2A] border-none outline-none"
                            placeholder="Enter task owner name"
                            readOnly
                        />
                        <p className="text-xs text-gray-500 mt-1">Max 2000 characters ({formData.taskOwner.length}/2000)</p>
                    </div>
                </div>

                {/* Task Workers (Multiple Selection) */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        <Users className="inline h-4 w-4 mr-1" />
                        Assign Task Workers
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                        {userMembersInfo.map(member => (
                            <div
                                key={member.accountID}
                                className={`border rounded-lg p-3 cursor-pointer transition-all ${formData.taskWorker.includes(member.id)
                                    ? 'border-blue-900 bg-[#2B2A2A]'
                                    : 'border-gray-300 hover:border-gray-400'
                                    }`}
                                onClick={() => handleWorkerToggle(member.accountID)}
                            >
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={formData.taskWorker.includes(member.accountID)}
                                        onChange={() => handleWorkerToggle(member.accountID)}
                                        className="h-4 w-4 rounded"
                                    />
                                    <span className="ml-2 text-sm capitalize">{member.username}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                        Selected: {formData.taskWorker.length} workers
                        {formData.taskWorker.length > 0 && (
                            <span className="ml-2 text-blue-300">
                                {formData.taskWorker.map(id => users?.documents.find(u => u.accountID === id)?.username).join(', ')}
                            </span>
                        )}
                    </p>
                </div>

                {/* Assign Project */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        <Folder className="inline h-4 w-4 mr-1" />
                        Assign to Project
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                        {userProjects.map(project => (
                            <div
                                key={project.id}
                                className={`border rounded-lg p-4 cursor-pointer transition-all ${formData.assignProjectId === project.id
                                    ? 'border-blue-900 bg-[#2B2A2A]'
                                    : 'border-gray-300 hover:border-gray-400 hover:bg-gray-800'
                                    }`}
                                onClick={() => setFormData(prev => ({ ...prev, assignProjectId: project.id }))}
                            >
                                <div className="flex items-center">
                                    <div className={`h-3 w-3 rounded-full mr-3 ${formData.assignProjectId === project.id ? 'bg-blue-500' : 'bg-gray-300'}`} />
                                    <span className="font-medium text-gray-100 capitalize">{project.projectName}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-4 pt-6 border-t">
                    <button
                        type="button"
                        onClick={() => {
                            setFormData({
                                taskName: '',
                                taskDescription: '',
                                dueDate: '',
                                priority: 'medium',
                                status: 'pending',
                                taskOwner: '',
                                taskWorker: [],
                                assignProjectId: ''
                            });
                        }}
                        className="px-6 py-3 border rounded-lg bg-[#2B2A2A] border-none outline-none"
                    >
                        Clear Form
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                    >
                        Create Task
                    </button>
                </div>
            </form>
        </div>
    );
}

export default ProjectTaskBoard