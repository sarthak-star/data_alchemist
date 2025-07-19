import { useEffect, useState } from "react";
import UploadModal from "../components/UploadModal";
import FileCard from "../components/FileCard";
import { FileX, FolderClosed, Plus } from "lucide-react";
import * as XLSX from "xlsx";

export default function ManageData() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [uploadedFiles, setUploadedFiles] = useState<
    { name: string; type: string; file: File }[]
  >([]);
  const [selectedTab, setSelectedTab] = useState<"client" | "worker" | "task">(
    "client"
  );

  useEffect(() => {
    const loadDemoFile = async () => {
      const response = await fetch("/dummyFiles/dummy_data.csv");
      const blob = await response.blob();
      const text = await blob.text();

      // Convert the text into a workbook
      const workbook = XLSX.read(text, { type: "string" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

      if (jsonData.length > 0) {
        const file = new File([blob], "dummy_data.csv", { type: "text/csv" });

        setUploadedFiles((prev) => [
          ...prev,
          { name: file.name, type: "client", file },
        ]);
      }
    };

    loadDemoFile();
  }, []);

  const handleUpload = (file: File, type: string) => {
    // setUploadedFiles([...uploadedFiles, { name: file.name, type, file }]);
    setUploadedFiles((prev) => {
      const updated = [...prev, { name: file.name, type, file }];
      return updated;
    });
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
      <div className="flex gap-4 h-4/5">
        {/* Sidebar tabs */}
        <div className="w-1/3 border-r  h-full ">
          <div className="flex md:flex-col gap-2 rounded-md p-4 shadow-xl">
            {(["client", "worker", "task"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`w-full flex items-center text-base gap-2 text-left px-4 py-2 rounded-md font-medium ${
                  selectedTab === tab
                    ? "bg-purple-600 text-white"
                    : "hover:text-white text-gray-400 "
                }`}
              >
                <FolderClosed size={20} />{" "}
                {tab.charAt(0).toUpperCase() + tab.slice(1)}s
              </button>
            ))}
          </div>
        </div>

        {/* File cards */}
        <div className="h-full w-full overflow-y-auto flex gap-4">
          {filteredFiles.length > 0 ? (
            filteredFiles.map((file, index) => (
              <div className="w-1/3" key={index} id={`file-card-${index}`}>
                <FileCard file={file} />
              </div>
            ))
          ) : (
            <div className="flex flex-col w-full justify-center items-center gap-5 text-gray-400 text-center text-2xl py-10">
              <FileX size={72} /> No {selectedTab}s uploaded yet.
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <UploadModal
          onClose={() => setIsModalOpen(false)}
          onUpload={handleUpload}
        />
      )}
    </div>
  );
}
