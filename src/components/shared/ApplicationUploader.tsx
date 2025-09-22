import { useState, useEffect } from "react";
import { FilePlus2 } from "lucide-react";

type ApplicationUploaderProps = {
    onFileSelect: (files: File[]) => void;
    mediaUrl?: string;
    inputId?: string; // 👈 make id customizable
};

function ApplicationUploader({ onFileSelect, mediaUrl, inputId = "application-file" }: ApplicationUploaderProps) {
    const [files, setFiles] = useState<File[]>([]);
    const [fileUrl, setFileUrl] = useState<string | undefined>(mediaUrl);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const selectedFiles = Array.from(e.target.files);
        setFiles(selectedFiles);
        onFileSelect(selectedFiles);
        console.log(files);
        

        const previewUrl = URL.createObjectURL(selectedFiles[0]);
        setFileUrl(previewUrl);
    };

    useEffect(() => {
        return () => {
            if (fileUrl?.startsWith("blob:")) {
                URL.revokeObjectURL(fileUrl);
            }
        };
    }, [fileUrl]);

    return (
        <div className="flex flex-center">
            <input
                id={inputId}
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={handleFileChange}
            />

            <label
                htmlFor={inputId}
                className="cursor-pointer flex flex-col items-center gap-2"
            >
                <span className={`rounded-md p-[11.75px] flex flex-center ${fileUrl ? "bg-gray-700 font-light" : "shad-button_primary"
                    }`}>
                    <FilePlus2 size={16} />
                </span>
            </label>
        </div>
    );
}

export default ApplicationUploader;

