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
        <h2 className="text-xl font-bold mb-4 text-gray-800">Upload File</h2>

        {/* Dropdown */}
        <label className="block text-sm text-gray-700 mb-2">Select File Type</label>
        <select
          className="w-full border border-gray-300 rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option value="client">Client</option>
          <option value="worker">Worker</option>
          <option value="task">Task</option>
        </select>

        {/* Dropzone */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-md p-6 text-center transition-colors ${
            isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
          }`}
        >
          <input {...getInputProps()} />
          {selectedFile ? (
            <p className="text-gray-700 font-medium">{selectedFile.name}</p>
          ) : isDragActive ? (
            <p className="text-blue-500 font-medium">Drop the file here ...</p>
          ) : (
            <p className="text-gray-500">Drag & drop a CSV/XLSX file, or click to select</p>
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
