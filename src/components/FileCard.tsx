import { FileSpreadsheet } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface FileCardProps {
  file: {
    file: File;
    name: string;
    type: string;
  };
}

export const typeColors: Record<string, string> = {
  client: "bg-blue-100 text-blue-700",
  worker: "bg-green-100 text-green-700",
  task: "bg-yellow-100 text-yellow-700",
};

export default function FileCard({ file }: FileCardProps) {
  const navigate = useNavigate();

  const handleNavigate = () => {
    const fileNameWithoutExtension = file.name.replace(/\.[^/.]+$/, "");
    navigate(`/manage/${file.type}/${encodeURIComponent(fileNameWithoutExtension)}`, {
      state: { file: file.file },
    });
  };

  return (
    <div
      onClick={handleNavigate}
      className="cursor-pointer  hover:border-purple-400 border border-gray-500 shadow-md rounded-md p-4 h-fit  flex items-center gap-4"
    >
      <div className="bg-purple-100 p-2 rounded-full">
        <FileSpreadsheet className="text-purple-600" size={24} />
      </div>

      <div className="flex flex-col flex-grow">
        <span className="font-medium text-white truncate">{file.name}</span>
        <span
          className={`text-xs mt-1 w-fit px-2 py-0.5 rounded ${
            typeColors[file.type]
          }`}
        >
          {file.type.charAt(0).toUpperCase() + file.type.slice(1)} File
        </span>
      </div>
    </div>
  );
}
