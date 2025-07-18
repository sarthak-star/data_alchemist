import { useLocation, useParams } from "react-router-dom"; // You should have a global store/context
import DataGridViewer from "../components/DataGridViewer";
import { typeColors } from "../components/FileCard";
import { Download } from "lucide-react";
import { useRuleContext } from "../context/RuleContext"; // Import RuleContext hook
import { useState } from "react";
import * as XLSX from "xlsx";

export default function FileEditor() {
  const location = useLocation();
  const file = location.state?.file as File;
  const { fileType = "" } = useParams(); // from /manage/:type/:filename
  const { state } = useRuleContext(); // Access the global state
  const [currentGridData, setCurrentGridData] = useState<any[]>([]);

  const [selectedRuleSet, setSelectedRuleSet] = useState<string>(); // Local state for selected rule set

  if (!file) {
    return <p className="text-red-600">File not found.</p>;
  }

  // Handle change of selected rule set
  const handleRuleSetChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRuleSet(event.target.value);
  };

  const handleExportData = (format: "xlsx" | "csv") => {
    if (!currentGridData.length) {
      alert("No data to export.");
      return;
    }

    // Remove internal `errors` column if you don't want to export validation data
    const cleanedData = currentGridData.map(({ errors, ...rest }) => rest);

    const worksheet = XLSX.utils.json_to_sheet(cleanedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    if (format === "csv") {
      XLSX.writeFile(workbook, "exported_data.csv", { bookType: "csv" });
    } else {
      XLSX.writeFile(workbook, "exported_data.xlsx", { bookType: "xlsx" });
    }
  };

  const handleExportRules = () => {
    if (!selectedRuleSet) {
      alert("No rule set selected.");
      return;
    }

    const blob = new Blob([selectedRuleSet], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "validation_rules.json";
    link.click();
  };

  return (
    <div className="p-6 pt-32 text-white h-screen">
      <div className="flex justify-between mb-5">
        <div className="flex gap-2 items-end">
          <h1 className="font-medium text-white truncate text-2xl">{file.name}</h1>
          <span className={`text-xs px-2 py-1 rounded ${typeColors[fileType ?? ""]}`}>
            {fileType.charAt(0).toUpperCase() + fileType.slice(1)} File
          </span>
        </div>
        <div className="flex gap-2">
          {/* Dropdown for rule set selection */}
          <div className="flex items-end ">
            <label htmlFor="rule-set-select" className="text-lg">
              Select Rule Set
            </label>
            <select id="rule-set-select" className="ml-2 p-2 rounded text-black" value={selectedRuleSet} onChange={handleRuleSetChange}>
              <option value="">-- Select Rule Set --</option>
              {state.ruleSets.map((ruleSet: { name: string; rules: any[] }) => (
                <option key={ruleSet.name} value={JSON.stringify(ruleSet.rules)}>
                  {ruleSet.name}
                </option>
              ))}
            </select>
          </div>
          <button className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded-md font-small" onClick={() => handleExportData("xlsx")}>
            <Download size={18} /> Export Data
          </button>
          <button className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded-md font-small" onClick={handleExportRules}>
            <Download size={18} /> Export Rules
          </button>
        </div>
      </div>

      <div className="h-4/5">
        {/* Pass the selected rules as props to DataGridViewer */}
        <DataGridViewer file={file} validationOptions={selectedRuleSet ?? "[]"} onDataUpdate={setCurrentGridData} />
      </div>
    </div>
  );
}
