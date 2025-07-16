import { UploadIcon } from "lucide-react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

interface UploadModalProps {
  onClose: () => void;
  onUpload: (file: File, type: string) => void;
}

export default function UploadModal({ onClose, onUpload }: UploadModalProps) {
  const [selectedType, setSelectedType] = useState("client");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "application/vnd.ms-excel": [".xls"],
    },
    multiple: false,
  });

  const handleUpload = () => {
    if (selectedFile) {
      onUpload(selectedFile, selectedType);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <h2 className="text-2xl mb-2 font-bold text-gray-800">Upload File</h2>

        {/* Dropdown */}
        <select
          className="w-full border border-gray-300 rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option disabled value="">Select File Type</option>
          <option value="client">Client</option>
          <option value="worker">Worker</option>
          <option value="task">Task</option>
        </select>

        {/* Dropzone */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-md p-6 text-center transition-colors ${
            isDragActive ? "border-purple-500 bg-blue-50" : "border-purple-300"
          }`}
        >
          <input {...getInputProps()} />
          {selectedFile ? (
            <p className="font-medium text-purple-500">{selectedFile.name}</p>
          ) : isDragActive ? (
            <div className="text-purple-500 flex flex-col items-center gap-2"><UploadIcon size={30}/> Drop the file here ...</div>
          ) : (
            <div className="text-purple-500 flex flex-col items-center gap-2 cursor-pointer"><UploadIcon size={30}/> Drag & drop a CSV/XLSX file, or click to select</div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            disabled={!selectedFile}
            onClick={handleUpload}
            className="px-4 py-2 rounded-md bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50"
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
}
