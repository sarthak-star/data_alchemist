import React, { useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx";
import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ModuleRegistry, themeMaterial } from "ag-grid-community";

ModuleRegistry.registerModules([AllCommunityModule]);

interface Props {
  file: File;
}

export default function DataGridViewer({ file }: Props) {
  const [columns, setColumns] = useState<any[]>([]);
  const [rows, setRows] = useState<any[]>([]);

  useEffect(() => {
    const parseFile = async () => {
      if (!file || !(file instanceof Blob)) {
        console.error("Invalid file:", file);
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, {
          defval: "",
        });
        if (jsonData.length > 0) {
          const firstRow = jsonData[0];
          const columnDefs = Object.keys(firstRow).map((key) => ({
            headerName: key,
            field: key,
            editable: true,
            cellRenderer: (params: any) => {
              const value = params.value;
              const error = params.data?.error;

              // Show error message below the cell value if there's an error
              return (
                <div className={`${error ? 'bg-red-500 text-white ' : 'text-black bg-white'}`} >
                  <div>{value}</div>
                  {error && <div style={{ fontSize: "12px" }}>{error}</div>}
                </div>
              );
            },
            cellStyle: (params: any) => {
              // Only highlight the error cell
              if (params.data?.error && params.column.colId === params.colDef.field) {
                return { backgroundColor: "#ef4444", color: "white" }; // Highlight error cell
              }
              return { backgroundColor: 'white', color: 'black' }; // Normal cell style
            },
          }));

          const jsonRows = jsonData.map((rowData) => ({ ...rowData }));
          setColumns(columnDefs);
          setRows(jsonRows);
        }
      };
      reader.readAsArrayBuffer(file);
    };

    parseFile();
  }, [file]);

  const validationRules = [
    { column: "Age", type: "range", minValue: 18, maxValue: 100, message: "Age must be between 18 and 100" },
    { column: "client_email", type: "email", message: "Invalid email format" },
    { column: "client_name", type: "required", message: "Name cannot be empty" },
  ];

  const getValidatorForColumn = (columnName: string) => {
    const rule = validationRules.find((rule) => rule.column === columnName);
    if (!rule) return null;

    return (params: any) => {
      const value = params.newValue;
      let errorMessage = "";

      switch (rule.type) {
        case "range":
          if (value < rule.minValue! || value > rule.maxValue!) {
            errorMessage = rule.message;
          }
          break;
        case "email":
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            errorMessage = rule.message;
          }
          break;
        case "required":
          if (!value || value.trim() === "") {
            errorMessage = rule.message;
          }
          break;
        default:
          break;
      }

      if (errorMessage) {
        return { valid: false, error: errorMessage }; // Return error message
      }

      return { valid: true, error: null }; // No error
    };
  };

  const defaultColDef = {
    editable: true,
    flex: 1,
    minWidth: 180,
    filter: true,
  };

  const myTheme = themeMaterial.withParams({
    spacing: 8,
    accentColor: "purple",
    headerTextColor: "purple",
    headerFontSize: "0.9rem",
    headerColumnResizeHandleColor: "purple"
  });

  const theme = useMemo(() => {
    return myTheme;
  }, []);

  return (
    <div className="rounded-2xl" style={{ height: "100%", width: "100%" }}>
      <AgGridReact
        theme={theme}
        columnDefs={columns}
        rowData={rows}
        domLayout="normal"
        animateRows={true}
        pagination={true}
        editType="singleCell"
        onCellValueChanged={(event: any) => {
          const { colDef, data } = event;
          const validator = getValidatorForColumn(colDef.field ?? "");
          if (validator) {
            const res = validator(event);
            if (!res.valid) {
              data.error = res.error; // Store error message on the specific cell
            } else {
              delete data.error; // Clear error if valid
            }
            // Trigger grid refresh to apply styles
            event.api.refreshCells({ rowNodes: [event.node], force: true });
          }
        }}
        defaultColDef={defaultColDef}
        className="bg-white"
      />
    </div>
  );
}
