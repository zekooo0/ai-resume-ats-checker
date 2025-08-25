"use client"

import { useState } from "react"
import { UploadCloud } from "lucide-react"

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
}

export default function FileUpload({ onFileSelect }: FileUploadProps) {
  const [fileName, setFileName] = useState<string | null>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files.length > 0 ? event.target.files[0] : null;
    setFileName(file ? file.name : null);
    onFileSelect(file);
  }

  return (
    <div className="w-full">
      <label
        htmlFor="resume-upload"
        className="relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted transition-colors"
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <UploadCloud className="w-10 h-10 mb-3 text-muted-foreground" />
          <p className="mb-2 text-sm text-muted-foreground">
            <span className="font-semibold">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-muted-foreground">PDF or DOCX (MAX. 5MB)</p>
        </div>
        <input id="resume-upload" type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.docx" />
      </label>
      {fileName && (
        <div className="mt-2 text-sm text-center text-muted-foreground">
          Selected file: {fileName}
        </div>
      )}
    </div>
  )
}
