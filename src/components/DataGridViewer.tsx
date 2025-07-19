import { useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx";
import { AgGridReact } from "ag-grid-react";
import {
  AllCommunityModule,
  ModuleRegistry,
  themeMaterial,
} from "ag-grid-community";
import type { Rule } from "../screens/ConfigureRules";
import { getValidatorForColumn } from "../utils/Validators";

ModuleRegistry.registerModules([AllCommunityModule]);

interface Props {
  file: File;
  validationOptions: string; // This is your global state that contains validation rules
  onDataUpdate?: (rows: any[]) => void;
  onGridReady?: (params: any) => void;
}

export default function DataGridViewer({
  file,
  validationOptions,
  onDataUpdate,
  onGridReady,
}: Props) {
  const [columns, setColumns] = useState<any[]>([]);
  const [rows, setRows] = useState<any[]>([]);
  const [validationRules, setValidationRules] = useState<any[]>([]);

  useEffect(() => {
    setValidationRules(JSON.parse(validationOptions) ?? "[]");
  }, [validationOptions]);

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
              const errorObj = params.data?.errors?.[params.column.colId];
              const errorColor = errorObj?.color || "#ef4444";

              return (
                <div
                  className={`${errorObj ? "text-white" : "text-black"}`}
                  style={{ backgroundColor: errorObj ? errorColor : "white" }}
                >
                  <div>{value}</div>
                  {/* {errorObj && (
                    <div style={{ fontSize: "12px" }}>
                      {value} {errorObj.error}
                    </div>
                  )} */}
                </div>
              );
            },
            cellStyle: (params: any) => {
              const errorObj = params.data?.errors?.[params.colDef.field];
              return errorObj
                ? {
                    backgroundColor: errorObj.color || "#ef4444",
                    color: "white",
                  }
                : { backgroundColor: "white", color: "black" };
            },
            tooltipValueGetter: (params: any) => {
              const errorObj = params.data?.errors?.[params.colDef.field];
              return errorObj ? errorObj.error : null; // ✅ Tooltip only shows if error exists
            },
          }));

          const jsonRows = jsonData.map((rowData, index) => ({
            ...rowData,
            errors: {},
            _errorCount: 0,
            __rowId: index.toString(),
          }));
          setColumns(columnDefs);
          const rowsWithErrors = jsonRows.map((row) => ({
            ...row,
            _errorCount: Object.keys(row.errors || {}).length,
          }));
          setRows(rowsWithErrors);
          onDataUpdate?.(rowsWithErrors);
        }
      };
      reader.readAsArrayBuffer(file);
    };

    parseFile();
  }, [file]);

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
    headerColumnResizeHandleColor: "purple",
  });

  const theme = useMemo(() => {
    return myTheme;
  }, []);

  return (
    <div className="rounded-2xl" style={{ height: "100%", width: "100%" }}>
      <AgGridReact
        getRowId={(params) => params.data.__rowId}
        onGridReady={onGridReady}
        theme={theme}
        columnDefs={columns}
        rowData={rows}
        domLayout="normal"
        animateRows={true}
        pagination={true}
        editType="singleCell"
        onCellValueChanged={(event: any) => {
          const updatedRows = rows.map((row) => {
            const updatedErrors: Record<
              string,
              { error: string; color: string }
            > = {};

            Object.keys(row).forEach((key) => {
              if (["errors", "_errorCount", "__rowId"].includes(key)) return;
              const validator = getValidatorForColumn(key, validationRules);
              if (validator) {
                const result = validator({ newValue: row[key] });
                if (!result.valid && result.error) {
                  updatedErrors[key] = {
                    error: result.error,
                    color: result.errorColor,
                  };
                }
              }
            });

            return {
              ...row,
              errors: updatedErrors,
              _errorCount: Object.keys(updatedErrors).length,
            };
          });

          setRows(updatedRows);
          onDataUpdate?.(updatedRows);

          // Apply updated rows in AG Grid
          event.api.applyTransaction({ update: updatedRows });
        }}
        defaultColDef={defaultColDef}
        className="bg-white"
      />
    </div>
  );
}
