import { useState } from 'react';
import {
    ClipboardList,
    Clock,
    CheckCircle,
    AlertTriangle,
    FileText,
    Calendar,
    AlertCircle,
    Upload,
    X,
    Lock
} from 'lucide-react';
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
import { useGetTasks, useGetProjects, useUpdateTaskWithFile } from '@/lib/react-query/queryandmutation';
import FileUploader from '@/components/shared/FileUploader';
import { useAlert } from '@/context/AlertContext';
import { ID } from 'appwrite';
import { appWriteConfig, storage } from '@/lib/appwrite/config';

function WorkerProjectView() {
    const { user } = useUserContext();
    const { showError, showSuccess } = useAlert();
    const { data: tasks, isLoading: isLoadingTasks } = useGetTasks();
    const { data: projects } = useGetProjects();
    const { mutate: updateTask, isPending: isUpdating } = useUpdateTaskWithFile();
    
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
    const [uploadedFileId, setUploadedFileId] = useState<string | null>(null);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

    // Filter tasks assigned to current worker
    const workerTasks = tasks?.documents?.filter(task =>
        task.taskWorker?.includes(user?.accountID)
    ) || [];

    // Filter tasks that are NOT completed, reviewed, or submitted
    const submittableTasks = workerTasks.filter(task => 
        task.status === 'in-progress' || 
        task.status === 'pending'
    );

    // Calculate statistics
    const totalTasks = workerTasks.length;
    const inProgressTasks = workerTasks.filter(task => task.status === 'in-progress').length;
    const completedTasks = workerTasks.filter(task => task.status === 'completed').length;
    const submittedTasks = workerTasks.filter(task => task.status === 'review' || task.status === 'submitted').length;
    const overdueTasks = workerTasks.filter(task => {
        if (!task.dueDate) return false;
        try {
            return new Date(task.dueDate) < new Date() && task.status !== 'completed' && task.status !== 'review';
        } catch {
            return false;
        }
    }).length;

    // Get project name by ID
    const getProjectName = (projectId: string) => {
        const project = projects?.documents?.find(p => p.$id === projectId);
        return project?.projectName || 'Unknown Project';
    };

    // Format date
    const formatDate = (dateString: string) => {
        try {
            return format(new Date(dateString), 'MMM dd, yyyy');
        } catch {
            return 'N/A';
        }
    };

    // Check if task is overdue
    const isOverdue = (dueDate: string) => {
        if (!dueDate) return false;
        try {
            return new Date(dueDate) < new Date();
        } catch {
            return false;
        }
    };

    // Get priority badge
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

    // Get status badge (read-only for workers)
    const getStatusBadge = (status: string) => {
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
            case 'submitted':
                return {
                    bg: 'bg-purple-900/30',
                    text: 'text-purple-300',
                    icon: <CheckCircle className="h-3 w-3 mr-1" />,
                    label: 'Submitted'
                };
            case 'pending':
                return {
                    bg: 'bg-yellow-900/30',
                    text: 'text-yellow-300',
                    icon: <Clock className="h-3 w-3 mr-1" />,
                    label: 'Pending'
                };
            case 'blocked':
                return {
                    bg: 'bg-red-900/30',
                    text: 'text-red-300',
                    icon: <X className="h-3 w-3 mr-1" />,
                    label: 'Blocked'
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

    // Open upload modal
    const openUploadModal = (taskId: string) => {
        setSelectedTaskId(taskId);
        setUploadedFileId(null);
        setIsUploadModalOpen(true);
    };

    // Handle file upload completion
    const handleFileUploaded = async (files: File[]) => {
        if (files.length > 0) {
            try {
                const file = files[0];
                const fileId = ID.unique();
                const result = await storage.createFile(
                    appWriteConfig.storageBucketID,
                    fileId,
                    file
                );
                setUploadedFileId(result.$id);
                showSuccess("File uploaded successfully!");
            } catch (error) {
                console.error('Upload failed:', error);
                showError("Failed to upload file");
                setUploadedFileId(null);
            }
        }
    };

    // Submit work with uploaded file
    const handleSubmitWork = () => {
        if (!selectedTaskId || !uploadedFileId) {
            showError("Please upload a file before submitting.");
            return;
        }

        updateTask({
            taskId: selectedTaskId,
            status: 'review', // Automatically set to review when file is uploaded
            fileId: uploadedFileId,
        }, {
            onSuccess: () => {
                showSuccess("Work submitted successfully! Status updated to 'Submitted'.");
                setIsUploadModalOpen(false);
                setSelectedTaskId(null);
                setUploadedFileId(null);
            },
            onError: () => {
                showError("Failed to submit work");
            }
        });
    };

    // Get current task for modal
    const getCurrentTask = () => {
        return workerTasks.find(task => task.$id === selectedTaskId);
    };

    if (isLoadingTasks) {
        return (
            <div className="w-full p-4">
                <div className="animate-pulse space-y-6">
                    <div className="h-8 bg-dark-4 rounded w-48"></div>
                    <div className="flex flex-wrap gap-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="w-[150px] h-[100px] bg-dark-4 rounded-xl"></div>
                        ))}
                    </div>
                    <div className="h-64 bg-dark-4 rounded-lg"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full p-4 md:p-6">
            {/* File Upload Modal */}
            {isUploadModalOpen && selectedTaskId && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className="bg-dark-3 rounded-xl p-6 w-full max-w-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-100">Submit Work</h3>
                            <button
                                onClick={() => {
                                    setIsUploadModalOpen(false);
                                    setSelectedTaskId(null);
                                    setUploadedFileId(null);
                                }}
                                className="text-gray-400 hover:text-gray-300"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="mb-6 p-4 bg-dark-4 rounded-lg">
                            <h4 className="text-gray-300 font-medium mb-2">Task Details</h4>
                            <div className="text-gray-400">
                                <p className="font-medium text-gray-100">{getCurrentTask()?.taskName}</p>
                                <p className="text-sm mt-1">Project: {getProjectName(getCurrentTask()?.assignProjectId)}</p>
                                <p className="text-sm">Due Date: {formatDate(getCurrentTask()?.dueDate)}</p>
                                <p className="text-sm">Current Status: <span className="text-yellow-300">{getCurrentTask()?.status}</span></p>
                            </div>
                            <div className="mt-3 p-3 bg-blue-900/30 border border-blue-700 rounded-lg">
                                <p className="text-sm text-blue-300">
                                    Status will automatically change to "Submitted" when you upload a file
                                </p>
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-gray-300 mb-3">Upload Your Completed Work File</label>
                            <FileUploader
                                fieldChange={handleFileUploaded}
                            />
                            <p className="text-sm text-gray-500 mt-2">
                                Upload your completed work file. Once uploaded, task status will be set to "Submitted".
                            </p>

                            {uploadedFileId && (
                                <div className="mt-3 p-3 bg-green-900/30 border border-green-700 rounded-lg flex items-center">
                                    <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                                    <span className="text-green-300 text-sm">File uploaded successfully!</span>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => {
                                    setIsUploadModalOpen(false);
                                    setSelectedTaskId(null);
                                    setUploadedFileId(null);
                                }}
                                className="px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmitWork}
                                disabled={!uploadedFileId || isUpdating}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isUpdating ? 'Submitting...' : 'Submit Work'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="header mb-6">
                <h2 className="text-2xl font-bold text-gray-100">My Work Dashboard</h2>
                <p className="text-gray-400 mt-1">Submit your completed work files</p>
            </div>

            {/* Stats Cards */}
            <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-300 mb-4">Task Overview</h3>
                <div className="task-card grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Total Tasks */}
                    <div className="w-full h-[100px] bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex gap-4 items-center justify-center text-white shadow-lg hover:shadow-xl transition-all cursor-pointer p-4">
                        <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-full">
                            <ClipboardList className="h-6 w-6" />
                        </div>
                        <div className='flex flex-col items-start'>
                            <p className="capitalize text-sm font-medium">Assigned Tasks</p>
                            <p className="text-3xl font-bold">{totalTasks}</p>
                        </div>
                    </div>

                    {/* Ready to Submit */}
                    <div className="w-full h-[100px] bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex gap-4 items-center justify-center text-white shadow-lg hover:shadow-xl transition-all cursor-pointer p-4">
                        <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-full">
                            <Upload className="h-6 w-6" />
                        </div>
                        <div className='flex flex-col items-start'>
                            <p className="capitalize text-sm font-medium">Ready to Submit</p>
                            <p className="text-3xl font-bold">{submittableTasks.length}</p>
                        </div>
                    </div>

                    {/* Submitted */}
                    <div className="w-full h-[100px] bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex gap-4 items-center justify-center text-white shadow-lg hover:shadow-xl transition-all cursor-pointer p-4">
                        <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-full">
                            <CheckCircle className="h-6 w-6" />
                        </div>
                        <div className='flex flex-col items-start'>
                            <p className="capitalize text-sm font-medium">Submitted</p>
                            <p className="text-3xl font-bold">{submittedTasks}</p>
                        </div>
                    </div>

                    {/* Overdue */}
                    <div className="w-full h-[100px] bg-gradient-to-br from-rose-500 to-rose-600 rounded-xl flex gap-4 items-center justify-center text-white shadow-lg hover:shadow-xl transition-all cursor-pointer p-4">
                        <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-full">
                            <AlertTriangle className="h-6 w-6" />
                        </div>
                        <div className='flex flex-col items-start'>
                            <p className="capitalize text-sm font-medium">Overdue</p>
                            <p className="text-3xl font-bold">{overdueTasks}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Task List Table */}
            <div className="w-full bg-dark-3 rounded-xl p-4">
                <div className="header mb-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="text-xl font-semibold text-gray-100">My Task List</h3>
                            <p className="text-gray-400 text-sm mt-1">
                                {totalTasks} task{totalTasks !== 1 ? 's' : ''} assigned • {submittableTasks.length} ready to submit
                            </p>
                        </div>
                    </div>
                </div>

                {workerTasks.length === 0 ? (
                    <div className="text-center py-12">
                        <FileText className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-300 mb-2">No Tasks Assigned</h3>
                        <p className="text-gray-500 max-w-md mx-auto">
                            You haven't been assigned any tasks yet. Contact your project manager for work assignments.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-dark-4">
                                    <TableHead className="text-gray-300">Task Name</TableHead>
                                    <TableHead className="text-gray-300">Project</TableHead>
                                    <TableHead className="text-gray-300">Due Date</TableHead>
                                    <TableHead className="text-gray-300">Status</TableHead>
                                    <TableHead className="text-gray-300">Priority</TableHead>
                                    <TableHead className="text-gray-300">File</TableHead>
                                    <TableHead className="text-gray-300">Upload File</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {workerTasks.map((task) => {
                                    const priorityBadge = getPriorityBadge(task.priority);
                                    const statusBadge = getStatusBadge(task.status);
                                    const taskOverdue = isOverdue(task.dueDate);
                                    const canSubmit = task.status === 'in-progress' || task.status === 'pending';
                                    const hasFile = task.fileId || task.fileUrl;

                                    return (
                                        <TableRow
                                            key={task.$id}
                                            className={`hover:bg-dark-4 border-b border-dark-4 ${taskOverdue ? 'bg-red-900/10' : ''
                                                }`}
                                        >
                                            {/* Task Name */}
                                            <TableCell className="py-4">
                                                <div className="flex flex-col max-w-xs">
                                                    <div className="font-medium text-gray-100 truncate">
                                                        {task.taskName}
                                                    </div>
                                                    {task.taskDescription && (
                                                        <div className="text-sm text-gray-400 truncate">
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

                                            {/* Due Date */}
                                            <TableCell>
                                                <div className="flex items-center">
                                                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                                                    <div>
                                                        <div className={`font-medium ${taskOverdue ? 'text-red-400' : 'text-gray-300'
                                                            }`}>
                                                            {formatDate(task.dueDate)}
                                                        </div>
                                                        {taskOverdue && (
                                                            <div className="text-xs text-red-400">Overdue</div>
                                                        )}
                                                    </div>
                                                </div>
                                            </TableCell>

                                            {/* Status (Read-only) */}
                                            <TableCell>
                                                <div className={`px-3 py-1 rounded-full text-xs font-medium inline-flex items-center ${statusBadge.bg} ${statusBadge.text}`}>
                                                    {statusBadge.icon}
                                                    {statusBadge.label}
                                                </div>
                                            </TableCell>

                                            {/* Priority */}
                                            <TableCell>
                                                <div className={`px-3 py-1 rounded-full text-xs font-medium inline-flex items-center ${priorityBadge.bg} ${priorityBadge.text}`}>
                                                    {priorityBadge.icon}
                                                    {priorityBadge.label}
                                                </div>
                                            </TableCell>

                                            {/* File */}
                                            <TableCell>
                                                {hasFile ? (
                                                    <div className="flex items-center">
                                                        <FileText className="h-4 w-4 text-green-400 mr-2" />
                                                        <span className="text-sm text-gray-300 truncate max-w-[100px]">
                                                            File Uploaded
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-500 text-sm">No file</span>
                                                )}
                                            </TableCell>

                                            {/* UPLOAD FILE ACTION - Added in table row */}
                                            <TableCell>
                                                {canSubmit ? (
                                                    <button
                                                        className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                                                        onClick={() => openUploadModal(task.$id)}
                                                        disabled={isUpdating}
                                                    >
                                                        <Upload className="h-4 w-4 mr-2" />
                                                        Upload File
                                                    </button>
                                                ) : (
                                                    <div className="text-gray-500 text-sm flex items-center">
                                                        <Lock className="h-4 w-4 mr-2" />
                                                        Cannot submit
                                                    </div>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>
                )}

                {/* Instructions Panel */}
                {workerTasks.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-dark-4">
                        <div className="bg-dark-4 rounded-lg p-4">
                            <h4 className="text-gray-300 font-medium mb-2">How to Submit Work:</h4>
                            <ol className="text-sm text-gray-400 space-y-1 ml-6 list-decimal">
                                <li>Click "Upload File" button next to tasks marked "In Progress" or "Pending"</li>
                                <li>Upload your completed work file using the File Uploader</li>
                                <li>Click "Submit Work" - status will automatically change to "Submitted"</li>
                                <li>Project owner will review your submitted work</li>
                            </ol>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default WorkerProjectView;