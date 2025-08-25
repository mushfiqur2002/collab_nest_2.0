import { ImageUp } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useDropzone, type FileWithPath } from 'react-dropzone';
import { Button } from '../ui/button';

type FileUploaderProps = {
  fieldChange: (files: File[]) => void;
  mediaUrl?: string; // Optional, in case you already have a file URL
};

function FileUploader({ fieldChange, mediaUrl }: FileUploaderProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [fileUrl, setFileUrl] = useState<string | undefined>(mediaUrl);

  // Handle file drop
  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      if (!acceptedFiles.length) return;

      setFiles(acceptedFiles);
      fieldChange(acceptedFiles);

      // Create preview URL
      const previewUrl = URL.createObjectURL(acceptedFiles[0]);
      setFileUrl(previewUrl);
    },
    [fieldChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg'], // ✅ Correct MIME type
    },
    multiple: false, // Only allow one file
  });

  // Cleanup the URL object when component unmounts or file changes
  useEffect(() => {
    return () => {
      if (fileUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(fileUrl);
      }
    };
  }, [fileUrl]);

  return (
    <div
      {...getRootProps()}
      className="file_uploader-box bg-dark-3 flex flex-col items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-500 rounded-lg cursor-pointer"
    >
      <input {...getInputProps()} />

      {fileUrl ? (
        <div className="flex flex-col items-center gap-2">
          <img
            src={fileUrl}
            alt="Preview"
            className="w-32 h-32 object-cover rounded-lg border border-gray-400"
          />
          <p className="text-sm text-gray-400">
            {files[0]?.name || 'Uploaded image'}
          </p>
        </div>
      ) : (
        <>
          <ImageUp className="w-10 h-10 stroke-1 text-gray-300" />
          <h2 className="text-lg capitalize text-gray-200">
            {isDragActive ? 'Drop the file here' : 'Drag and drop an image'}
          </h2>
          <p className="text-sm text-gray-400">or</p>
          <Button
            type="button"
            variant="secondary"
            className="capitalize cursor-pointer"
          >
            Select from your device
          </Button>
        </>
      )}
    </div>
  );
}

export default FileUploader;
