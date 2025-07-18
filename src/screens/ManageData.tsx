import { useState } from "react";
import UploadModal from "../components/UploadModal";
import FileCard from "../components/FileCard";
import { FileX, FolderClosed, Plus } from "lucide-react";
import introJs from "intro.js";

export default function ManageData() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; type: string; file: File }[]>([]);
  const [selectedTab, setSelectedTab] = useState<"client" | "worker" | "task">("client");
  const [hasStartedTour, setHasStartedTour] = useState(false);

  const handleUpload = (file: File, type: string) => {
    setUploadedFiles([...uploadedFiles, { name: file.name, type, file }]);
    setIsModalOpen(false);
  };

  const filteredFiles = uploadedFiles.filter((f) => f.type === selectedTab);

  return (
    <div className="bg-gray-800 h-screen p-6 pt-32">
      {/* Upload button */}
      <div className="flex justify-end mb-6">
        <button
          id="btn-upload"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1 bg-purple-500 text-white px-4 py-2 rounded-md font-medium"
        >
          <Plus size={22} /> Upload File
        </button>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Sidebar tabs */}
        <div className="md:col-span-1">
          <div className="flex md:flex-col gap-2 rounded-md p-4 shadow-md">
            {(["client", "worker", "task"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`w-full flex items-center text-base gap-2 text-left px-4 py-2 rounded-md font-medium ${
                  selectedTab === tab ? "bg-purple-600 text-white" : "hover:text-white text-gray-400 "
                }`}
              >
                <FolderClosed size={20} /> {tab.charAt(0).toUpperCase() + tab.slice(1)}s
              </button>
            ))}
          </div>
        </div>

        {/* File cards */}
        <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFiles.length > 0 ? (
            filteredFiles.map((file, index) => <div key={index} id={`file-card-${index}`} ><FileCard  file={file} /></div> )
          ) : (
            <div className="col-span-full flex flex-col items-center gap-5 text-gray-500 text-center text-2xl py-10">
              <FileX size={72} /> No {selectedTab}s uploaded yet.
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && <UploadModal onClose={() => setIsModalOpen(false)} onUpload={handleUpload} />}
    </div>
  );
}
