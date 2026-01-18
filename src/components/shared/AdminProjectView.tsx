import { useState, useEffect } from 'react';
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
    Calendar,
    FileText,
    Folder,
    MoreVertical,
    Download,
    X,
    Paperclip
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
import { storage } from '@/lib/appwrite/config'; // Import Appwrite storage
import { ID } from 'appwrite'; // Import ID for type checking

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

// Files Modal Component
interface TaskFilesModalProps {
    isOpen: boolean;
    onClose: () => void;
    taskId: string;
    taskName?: string;
    fileId?: string; // Add fileId prop
}

const TaskFilesModal = ({ isOpen, onClose, taskId, taskName, fileId }: TaskFilesModalProps) => {
    const [files, setFiles] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch file from Appwrite when modal opens
    useEffect(() => {
        const fetchFileFromAppwrite = async () => {
            if (!isOpen || !fileId) return;
            
            setIsLoading(true);
            setError(null);
            try {
                // Replace with your actual Appwrite bucket ID
                const bucketId = import.meta.env.VITE_APPWRITE_STORAGE_BUCKET_ID || 'your-bucket-id';
                
                console.log('Fetching file with ID:', fileId);
                console.log('Bucket ID:', bucketId);
                
                // Get file metadata from Appwrite
                const fileMetadata = await storage.getFile(bucketId, fileId);
                console.log('File metadata:', fileMetadata);
                
                // Get file URL for download
                const fileUrl = storage.getFileView(bucketId, fileId);
                console.log('File URL:', fileUrl);
                
                // You can also get a preview URL if needed:
                // const previewUrl = storage.getFilePreview(bucketId, fileId);
                
                const fileData = {
                    ...fileMetadata,
                    name: fileMetadata.name,
                    size: fileMetadata.sizeOriginal,
                    type: fileMetadata.mimeType,
                    url: fileUrl.toString(),
                    uploadedAt: fileMetadata.$createdAt
                };
                
                setFiles([fileData]);
            } catch (error: any) {
                console.error('Error fetching file from Appwrite:', error);
                setError(`Failed to load file: ${error.message}`);
                setFiles([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchFileFromAppwrite();
    }, [isOpen, fileId]);

    // Helper function to get file icon
    const getFileIcon = (fileName: string, mimeType?: string) => {
        const ext = fileName.split('.').pop()?.toLowerCase();
        const type = mimeType?.toLowerCase() || '';
        
        if (ext === 'pdf' || type.includes('pdf')) 
            return <FileText className="h-8 w-8 text-red-500" />;
        if (['doc', 'docx'].includes(ext || '') || type.includes('word')) 
            return <FileText className="h-8 w-8 text-blue-500" />;
        if (['xls', 'xlsx', 'csv'].includes(ext || '') || type.includes('excel') || type.includes('sheet')) 
            return <FileText className="h-8 w-8 text-green-500" />;
        if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(ext || '') || type.includes('image')) 
            return <FileText className="h-8 w-8 text-purple-500" />;
        if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext || '') || type.includes('zip') || type.includes('compressed')) 
            return <Folder className="h-8 w-8 text-yellow-500" />;
        if (['mp4', 'avi', 'mov', 'wmv', 'mkv'].includes(ext || '') || type.includes('video')) 
            return <FileText className="h-8 w-8 text-orange-500" />;
        if (['mp3', 'wav', 'ogg', 'm4a'].includes(ext || '') || type.includes('audio')) 
            return <FileText className="h-8 w-8 text-pink-500" />;
        return <FileText className="h-8 w-8 text-gray-500" />;
    };

    // Helper function to format file size
    const formatFileSize = (bytes: number) => {
        if (!bytes) return 'Unknown size';
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-dark-3 rounded-lg p-6 w-full max-w-3xl max-h-[80vh] overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-xl font-bold text-gray-100 flex items-center gap-2">
                            <Paperclip className="h-5 w-5" />
                            Task File
                        </h3>
                        {taskName && (
                            <p className="text-sm text-gray-400 mt-1">
                                File attached to task: <span className="text-gray-300 font-medium">{taskName}</span>
                            </p>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-dark-4 rounded-lg text-gray-400 hover:text-white"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-4 bg-red-900/20 border border-red-700 rounded-lg">
                        <p className="text-red-400">{error}</p>
                        <p className="text-sm text-gray-400 mt-1">
                            File ID: <code className="bg-dark-4 px-2 py-1 rounded text-xs">{fileId}</code>
                        </p>
                    </div>
                )}

                {/* Files Content */}
                {isLoading ? (
                    <div className="flex flex-col justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                        <p className="text-gray-400">Loading file from Appwrite...</p>
                    </div>
                ) : files.length === 0 && !error ? (
                    <div className="text-center py-12">
                        <FileText className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                        <h4 className="text-lg font-medium text-gray-300 mb-2">No File Found</h4>
                        <p className="text-gray-500">This task doesn't have an uploaded file.</p>
                        {fileId && (
                            <p className="text-sm text-gray-600 mt-2">
                                File ID: <code className="bg-dark-4 px-2 py-1 rounded">{fileId}</code>
                            </p>
                        )}
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* File Information */}
                        {files.map((file, index) => (
                            <div key={index} className="bg-dark-4 rounded-lg p-6">
                                <div className="flex flex-col md:flex-row md:items-start gap-6">
                                    {/* File Icon and Name */}
                                    <div className="flex-shrink-0">
                                        <div className="flex flex-col items-center">
                                            {getFileIcon(file.name, file.type)}
                                            <div className="mt-4 text-center">
                                                <button
                                                    onClick={() => window.open(file.url, '_blank')}
                                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors flex items-center gap-2"
                                                >
                                                    <Download className="h-4 w-4" />
                                                    Download File
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* File Details */}
                                    <div className="flex-1">
                                        <h5 className="text-xl font-bold text-gray-100 mb-2">{file.name}</h5>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                            <div className="space-y-3">
                                                <div>
                                                    <p className="text-sm text-gray-400 mb-1">File Size</p>
                                                    <p className="text-gray-100 font-medium">
                                                        {formatFileSize(file.size)}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-400 mb-1">File Type</p>
                                                    <p className="text-gray-100 font-medium">
                                                        {file.type || 'Unknown'}
                                                    </p>
                                                </div>
                                            </div>
                                            
                                            <div className="space-y-3">
                                                <div>
                                                    <p className="text-sm text-gray-400 mb-1">Uploaded Date</p>
                                                    <p className="text-gray-100 font-medium flex items-center gap-2">
                                                        <Calendar className="h-4 w-4" />
                                                        {file.uploadedAt ? new Date(file.uploadedAt).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        }) : 'Unknown'}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-400 mb-1">File ID</p>
                                                    <p className="text-gray-100 font-mono text-sm break-all">
                                                        {file.$id}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* File Preview (for images and PDFs) */}
                                        {(file.type?.includes('image') || file.type?.includes('pdf')) && (
                                            <div className="mt-6 pt-6 border-t border-dark-3">
                                                <p className="text-sm text-gray-400 mb-3">Preview</p>
                                                {file.type?.includes('image') ? (
                                                    <div className="flex justify-center">
                                                        <img 
                                                            src={file.url} 
                                                            alt={file.name}
                                                            className="max-h-64 rounded-lg border border-dark-3"
                                                            onError={(e) => {
                                                                (e.target as HTMLImageElement).style.display = 'none';
                                                            }}
                                                        />
                                                    </div>
                                                ) : file.type?.includes('pdf') ? (
                                                    <div className="bg-dark-3 p-4 rounded-lg">
                                                        <p className="text-gray-400 text-sm">
                                                            PDF file - Use the download button above to view
                                                        </p>
                                                    </div>
                                                ) : null}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Footer */}
                <div className="flex justify-between items-center mt-6 pt-6 border-t border-dark-4">
                    <div className="text-sm text-gray-500">
                        File stored in Appwrite Storage
                    </div>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

// Task Type
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
    uploadedFile?: string; // This should contain the Appwrite file ID
    [key: string]: any;
};

function AdminProjectView() {
    const { user } = useUserContext();
    const { data: projects, isLoading: isLoadingProjects } = useGetProjects();
    const { data: tasks, isLoading: isLoadingTasks } = useGetTasks();
    const { mutate: updateTask } = useUpdateTask();
    const { showSuccess } = useAlert()

    // State for status update modal
    const [selectedTask, setSelectedTask] = useState<TaskType | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // State for files modal
    const [isFilesModalOpen, setIsFilesModalOpen] = useState(false);
    const [selectedTaskForFiles, setSelectedTaskForFiles] = useState<{
        id: string, 
        name?: string,
        fileId?: string
    } | null>(null);

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

    // Handle viewing files
    const handleViewFiles = (task: any) => {
        console.log('Task clicked:', task);
        console.log('Uploaded file ID:', task.uploadedFile);
        
        if (!task.uploadedFile) {
            // Show alert if no file is attached
            alert('This task has no attached file.');
            return;
        }

        setSelectedTaskForFiles({
            id: task.$id,
            name: task.taskName,
            fileId: task.uploadedFile
        });
        setIsFilesModalOpen(true);
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

    // Check if task has uploaded file
    const hasUploadedFile = (task: any) => {
        return !!task.uploadedFile;
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

            {/* Files Modal */}
            <TaskFilesModal
                isOpen={isFilesModalOpen}
                onClose={() => {
                    setIsFilesModalOpen(false);
                    setSelectedTaskForFiles(null);
                }}
                taskId={selectedTaskForFiles?.id || ''}
                taskName={selectedTaskForFiles?.name}
                fileId={selectedTaskForFiles?.fileId} // Pass the file ID
            />

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
                                    const hasFile = hasUploadedFile(task);

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
                                                        {hasFile && (
                                                            <span className="ml-2 inline-flex items-center">
                                                                <Paperclip className="h-3 w-3 text-blue-400" />
                                                            </span>
                                                        )}
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

                                            {/* Status */}
                                            <TableCell>
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
                                                        className={`p-2 rounded-lg ${hasFile ? 'text-gray-400 hover:text-blue-400 hover:bg-dark-4' : 'text-gray-600 cursor-not-allowed'}`}
                                                        title={hasFile ? "View Uploaded File" : "No File Attached"}
                                                        onClick={() => hasFile && handleViewFiles(task)}
                                                        disabled={!hasFile}
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