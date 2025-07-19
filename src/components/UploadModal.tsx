import { ArrowDown, UploadIcon } from "lucide-react";
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
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
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
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-xl shadow-2xl w-full max-w-md p-6">
        <h2 className="text-2xl mb-2 font-bold text-white">Upload File</h2>

        {/* Dropdown */}
        <div className="relative mb-4">
          <select
            className="w-full appearance-none border cursor-pointer border-gray-700 rounded-md bg-gray-800 text-white px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option disabled value="">
              Select File Type
            </option>
            <option value="client">Client</option>
            <option value="worker">Worker</option>
            <option value="task">Task</option>
          </select>
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white text-sm">
            <ArrowDown size={18} />
          </div>
        </div>

        {/* Dropzone */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-md p-6 text-center transition-colors ${
            isDragActive
              ? "border-purple-400 bg-gray-800"
              : "border-purple-700 bg-gray-800"
          }`}
        >
          <input {...getInputProps()} />
          {selectedFile ? (
            <p className="font-medium text-purple-400">{selectedFile.name}</p>
          ) : isDragActive ? (
            <div className="text-purple-400 flex flex-col items-center gap-2">
              <UploadIcon size={30} /> Drop the file here ...
            </div>
          ) : (
            <div className="text-purple-400 flex flex-col items-center gap-2 cursor-pointer">
              <UploadIcon size={30} /> Drag & drop a CSV/XLSX file, or click to
              select
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md border border-gray-600 text-gray-300 hover:bg-gray-800"
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
