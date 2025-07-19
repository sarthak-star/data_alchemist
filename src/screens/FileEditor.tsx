import { useLocation, useParams } from "react-router-dom"; // You should have a global store/context
import DataGridViewer from "../components/DataGridViewer";
import { typeColors } from "../components/FileCard";
import {
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  Download,
  MoveRight,
  XCircle,
} from "lucide-react";
import { useRuleContext } from "../context/RuleContext"; // Import RuleContext hook
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import type { Rule } from "./ConfigureRules";
import { getValidatorForColumn } from "../utils/Validators";

export default function FileEditor() {
  const location = useLocation();
  const file = location.state?.file as File;
  const { fileType = "" } = useParams(); // from /manage/:type/:filename
  const { state } = useRuleContext(); // Access the global state
  const [currentGridData, setCurrentGridData] = useState<any[]>([]);
  const [gridApi, setGridApi] = useState<any>(null);
  const [errorRowIndices, setErrorRowIndices] = useState<number[]>([]);
  const [currentErrorIndex, setCurrentErrorIndex] = useState(0);
  const [selectedRuleSet, setSelectedRuleSet] = useState<string>(); // Local state for selected rule set

  if (!file) {
    return <p className="text-red-600">File not found.</p>;
  }

  // Handle change of selected rule set
  const handleRuleSetChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRuleSet(event.target.value);
  };

  const handleGridReady = (params: any) => {
    setGridApi(params.api);
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

  useEffect(() => {
    if (!selectedRuleSet || !gridApi || !currentGridData.length) return;
    const rules = JSON.parse(selectedRuleSet) as Rule[];

    const updatedData = currentGridData.map((row) => {
      const newErrors: Record<string, { error: string; color: string }> = {};

      Object.keys(row).forEach((key) => {
        if (key === "errors" || key === "_errorCount") return;
        const validator = getValidatorForColumn(key, rules);
        if (validator) {
          const result = validator({ newValue: row[key] });
          if (!result.valid && result.error) {
            newErrors[key] = {
              error: result.error,
              color: result.errorColor,
            };
          }
        }
      });

      return {
        ...row,
        errors: newErrors,
        _errorCount: Object.keys(newErrors).length,
      };
    });

    setCurrentGridData(updatedData); // Update your local state

    // ✅ Use AG Grid transaction to update rows
    gridApi.applyTransaction({ update: updatedData });

    // ✅ Recalculate error row indices
    const errorIndices = updatedData
      .map((row, index) => (row._errorCount > 0 ? index : -1))
      .filter((i) => i !== -1);
    setErrorRowIndices(errorIndices);
    setCurrentErrorIndex(0);
  }, [selectedRuleSet, gridApi]);

  const totalErrors = currentGridData.reduce(
    (acc, row) => acc + (row._errorCount || 0),
    0
  );
  return (
    <div className="p-6 pt-32 text-white h-screen">
      <div className="flex justify-between mb-5">
        <div className="flex gap-2 items-end">
          <h1 className="font-medium text-white truncate text-2xl">
            {file.name}
          </h1>
          <span
            className={`text-xs px-2 py-1 rounded ${
              typeColors[fileType ?? ""]
            }`}
          >
            {fileType.charAt(0).toUpperCase() + fileType.slice(1)} File
          </span>
          <span
            className={`flex items-center gap-1 font-semibold text-sm ${
              selectedRuleSet
                ? totalErrors === 0
                  ? "text-green-600"
                  : "text-red-600"
                : "text-yellow-600"
            }`}
          >
            {selectedRuleSet ? (
              totalErrors === 0 ? (
                <>
                  <CheckCircle size={16} className="text-green-600" />
                  Valid
                </>
              ) : (
                <>
                  <XCircle size={16} className="text-red-600" />
                  {totalErrors} errors
                </>
              )
            ) : (
              <>
                <AlertTriangle size={16} className="text-yellow-600" />
                No rule set selected
              </>
            )}
          </span>

          {totalErrors > 0 && (
            <button
              onClick={() => {
                if (!gridApi || errorRowIndices.length === 0) return;
                const nextIndex = errorRowIndices[currentErrorIndex];
                gridApi.ensureIndexVisible(nextIndex, "middle");
                setCurrentErrorIndex((prev) =>
                  prev + 1 < errorRowIndices.length ? prev + 1 : 0
                );
              }}
              className="ml-2 flex items-center gap-2 px-2 py-1 text-xs bg-transparent border border-red-500 text-red-500 rounded hover:bg-red-700 transition"
            >
              Next Error <MoveRight />
            </button>
          )}
        </div>
        <div className="flex gap-2">
          {/* Dropdown for rule set selection */}
          <div className="relative inline-block">
            <select
              id="rule-set-select"
              className="appearance-none px-4 py-2 pr-10 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              value={selectedRuleSet}
              onChange={handleRuleSetChange}
            >
              <option value="">Select Rule Set</option>
              {state.ruleSets.map((ruleSet: { name: string; rules: any[] }) => (
                <option
                  key={ruleSet.name}
                  value={JSON.stringify(ruleSet.rules)}
                >
                  {ruleSet.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-300 absolute top-1/2 right-3 transform -translate-y-1/2 pointer-events-none" />
          </div>
          <button
            className="flex items-center gap-1 bg-purple-500 text-white px-3 py-1 rounded-md font-small"
            onClick={() => handleExportData("xlsx")}
          >
            <Download size={18} /> Export Data
          </button>
          <button
            className="flex items-center gap-1 bg-purple-500 text-white px-3 py-1 rounded-md font-small"
            onClick={handleExportRules}
          >
            <Download size={18} /> Export Rules
          </button>
        </div>
      </div>

      <div className="h-4/5">
        {/* Pass the selected rules as props to DataGridViewer */}
        <DataGridViewer
          file={file}
          validationOptions={selectedRuleSet ?? "[]"}
          onDataUpdate={(data) => {
            setCurrentGridData(data);
            const errorRows = data
              .map((row, index) => (row._errorCount > 0 ? index : -1))
              .filter((i) => i !== -1);
            setErrorRowIndices(errorRows);
            setCurrentErrorIndex(0);
          }}
          onGridReady={handleGridReady}
        />
      </div>
    </div>
  );
}
