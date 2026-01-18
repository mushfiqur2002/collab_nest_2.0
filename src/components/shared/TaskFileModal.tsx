import { useState, useEffect } from 'react'; // Add useEffect import
import {
    // ... existing imports
    FileText,
    Folder,
    MoreVertical,
    Download, // Add this import
    X, // Add this import
    Paperclip, // Add this import
    Calendar
} from 'lucide-react'
import { useGetTasks } from '@/lib/react-query/queryandmutation';

// Add this after the StatusUpdateModal component
interface TaskFilesModalProps {
    isOpen: boolean;
    onClose: () => void;
    taskId: string;
    taskName?: string;
}

export const TaskFileModal = ({ isOpen, onClose, taskId, taskName }: TaskFilesModalProps) => {
    const [files, setFiles] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const { data: tasks } = useGetTasks();

    // Fetch files when modal opens
    useEffect(() => {
        const fetchFiles = async () => {
            if (!isOpen || !taskId) return;

            setIsLoading(true);
            try {
                // Get the current task from tasks data
                const task = tasks?.documents?.find(t => t.$id === taskId);

                if (task?.files && task.files.length > 0) {
                    // Assuming task.files contains file metadata or IDs
                    // If it's just IDs, you'd need to fetch each file from Appwrite
                    setFiles(task.files);
                } else {
                    setFiles([]);
                }
            } catch (error) {
                console.error('Error fetching files:', error);
                setFiles([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchFiles();
    }, [isOpen, taskId, tasks]);

    if (!isOpen) return null;

    // Helper function to get file icon
    const getFileIcon = (fileName: string) => {
        const ext = fileName.split('.').pop()?.toLowerCase();
        if (['pdf'].includes(ext || '')) return <FileText className="h-8 w-8 text-red-500" />;
        if (['doc', 'docx'].includes(ext || '')) return <FileText className="h-8 w-8 text-blue-500" />;
        if (['xls', 'xlsx', 'csv'].includes(ext || '')) return <FileText className="h-8 w-8 text-green-500" />;
        if (['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(ext || '')) return <FileText className="h-8 w-8 text-purple-500" />;
        if (['zip', 'rar', '7z'].includes(ext || '')) return <Folder className="h-8 w-8 text-yellow-500" />;
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

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-dark-3 rounded-lg p-6 w-full max-w-3xl max-h-[80vh] overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-xl font-bold text-gray-100 flex items-center gap-2">
                            <Paperclip className="h-5 w-5" />
                            Task Files
                        </h3>
                        {taskName && (
                            <p className="text-sm text-gray-400 mt-1">
                                For task: <span className="text-gray-300 font-medium">{taskName}</span>
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

                {/* Files Content */}
                {isLoading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : files.length === 0 ? (
                    <div className="text-center py-12">
                        <FileText className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                        <h4 className="text-lg font-medium text-gray-300 mb-2">No Files Found</h4>
                        <p className="text-gray-500">This task doesn't have any uploaded files.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <p className="text-gray-400">
                                Total files: <span className="text-gray-100 font-medium">{files.length}</span>
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {files.map((file, index) => {
                                // Handle different file structures
                                const fileName = file.name || file.fileName || `File ${index + 1}`;
                                const fileSize = file.size || file.fileSize;
                                const fileUrl = file.url || file.downloadUrl;
                                const fileType = file.type || file.fileType;

                                return (
                                    <div key={index} className="bg-dark-4 rounded-lg p-4 hover:bg-dark-4/80 transition-colors">
                                        <div className="flex items-start gap-4">
                                            <div className="flex-shrink-0">
                                                {getFileIcon(fileName)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h5 className="text-gray-100 font-medium truncate mb-1">
                                                    {fileName}
                                                </h5>
                                                <div className="text-sm text-gray-400 space-y-1">
                                                    {fileSize && (
                                                        <p className="flex items-center gap-2">
                                                            <span>Size: {formatFileSize(fileSize)}</span>
                                                        </p>
                                                    )}
                                                    {fileType && (
                                                        <p className="flex items-center gap-2">
                                                            <span>Type: {fileType}</span>
                                                        </p>
                                                    )}
                                                    {file.uploadedAt && (
                                                        <p className="flex items-center gap-2">
                                                            <Calendar className="h-3 w-3" />
                                                            <span>Uploaded: {new Date(file.uploadedAt).toLocaleDateString()}</span>
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            {fileUrl && (
                                                <div className="flex-shrink-0">
                                                    <button
                                                        onClick={() => window.open(fileUrl, '_blank')}
                                                        className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors"
                                                        title="Download"
                                                    >
                                                        <Download className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className="flex justify-end mt-6 pt-6 border-t border-dark-4">
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