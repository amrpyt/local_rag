import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '../components/ui/button';
import { Upload, File, CheckCircle, AlertCircle, Loader2, FileText, Link, Files } from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import apiClient from '../api/client';
import { toast } from 'sonner';
import { EmptyState } from '../components/ui/empty-state';

export default function UploadPage() {
  const { selectedProject } = useProject();
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    setFiles(prevFiles => [...prevFiles, ...acceptedFiles.map(file => Object.assign(file, {
      preview: URL.createObjectURL(file)
    }))]);
  }, []);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true,
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
    }
  });

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error("No files selected to upload.");
      return;
    }
    if (!selectedProject) {
      toast.error("Please select a project first.");
      return;
    }

    setIsUploading(true);
    const toastId = toast.loading(`Uploading ${files.length} file(s)...`);

    const uploadPromises = files.map(file => {
      const formData = new FormData();
      formData.append('file', file);
      return apiClient.post(`/data/upload/${selectedProject.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    });

    try {
      const results = await Promise.all(uploadPromises);
      
      const successfulUploads = results.filter(res => res.data.signal === 'file_upload_success');
      
      if (successfulUploads.length === files.length) {
        toast.success(`Successfully uploaded ${files.length} file(s).`, { id: toastId });
        setFiles([]);
      } else {
        const failedCount = files.length - successfulUploads.length;
        toast.error(`Could not upload ${failedCount} file(s). Check console for details.`, { id: toastId });
        results.forEach((res, index) => {
          if (res.data.signal !== 'file_upload_success') {
            console.error(`Failed to upload ${files[index].name}:`, res.data.signal);
          }
        });
      }

    } catch (error) {
      console.error("Upload failed:", error);
      toast.error(error.response?.data?.signal || "An unexpected error occurred during upload.", { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };
  
  const removeFile = (fileName) => {
    setFiles(files.filter(file => file.name !== fileName));
  };

  return (
    <div className="space-y-8 flex flex-col items-center">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-center">Upload Documents</h2>
        <p className="text-muted-foreground mt-2 text-center">
          Upload PDF or TXT documents to be processed and indexed for question answering.
        </p>
      </div>

      {!selectedProject && (
        <div className="flex items-center gap-2 text-destructive bg-destructive/10 p-4 rounded-md">
          <AlertCircle className="h-5 w-5" />
          <p>Please select a project from the header to begin uploading documents.</p>
        </div>
      )}

      <div {...getRootProps({ className: `w-full flex justify-center ${isDragActive ? 'border-primary bg-primary/10' : ''}` })}>
        <input {...getInputProps()} disabled={!selectedProject} />
        {files.length === 0 && selectedProject && (
            <EmptyState
                title="No Documents Uploaded"
                description="Drag 'n' drop PDF or TXT files here, or click the button below to select files."
                icons={[FileText, Link, Files]}
                action={{
                    label: "Choose Files",
                    onClick: open,
                }}
            />
        )}
      </div>

      {files.length > 0 && (
        <div className="w-full max-w-[620px]">
          <h3 className="text-lg font-medium mb-2">Files to Upload:</h3>
          <ul className="space-y-2">
            {files.map((file, index) => (
              <li key={index} className="flex items-center justify-between p-2 pl-4 bg-muted rounded-md">
                <div className="flex items-center gap-3">
                  <File className="h-5 w-5" />
                  <span className="font-mono text-sm">{file.name}</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground font-mono">{(file.size / 1024).toFixed(2)} KB</span>
                    <Button variant="ghost" size="icon" onClick={() => removeFile(file.name)} className="h-8 w-8">
                        <AlertCircle className="h-4 w-4 text-destructive" />
                    </Button>
                </div>
              </li>
            ))}
          </ul>
          <Button onClick={handleUpload} disabled={isUploading || !selectedProject} className="mt-4 w-full">
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              `Upload ${files.length} File(s) to Project ${selectedProject?.name}`
            )}
          </Button>
        </div>
      )}
    </div>
  );
} 