import { useLocation, useParams } from "react-router-dom"; // You should have a global store/context
import DataGridViewer from "../components/DataGridViewer";
import { typeColors } from "../components/FileCard";
import { Download } from "lucide-react";

export default function FileEditor() {
  const location = useLocation();
  const file = location.state?.file as File;
  const { fileName, fileType = '' } = useParams(); // from /manage/:type/:filename

  if (!file) {
    return <p className="text-red-600">File not found.</p>;
  }

  return (
    <div className="p-6 pt-28 text-white h-screen ">
      <div className="flex justify-between mb-5">
        <div className="flex gap-2 items-end ">
          <h1 className="font-medium text-white truncate text-2xl ">
            {file.name}
          </h1>
          <span
            className={`text-xs px-2 py-1 rounded ${
              typeColors[fileType ?? ""]
            }`}
          >
            {fileType.charAt(0).toUpperCase() + fileType.slice(1)} File
          </span>
        </div>
        <div className="flex gap-2">
          <button
            className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded-md font-small"
          >
            <Download size={18} /> Export Data
          </button>
          <button
            className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded-md font-small"
          >
            <Download size={18} /> Export Rules
          </button>
        </div>
      </div>
      <DataGridViewer file={file} />
    </div>
  );
}
