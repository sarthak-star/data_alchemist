import { useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx";
import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ModuleRegistry, themeMaterial } from "ag-grid-community";

ModuleRegistry.registerModules([AllCommunityModule]);

interface Rule {
  column: string;
  type: string;
  minValue?: number;
  maxValue?: number;
  errorMessage: string;
}


interface Props {
  file: File;
  validationOptions: string; // This is your global state that contains validation rules
}

export default function DataGridViewer({ file, validationOptions }: Props) {
  const [columns, setColumns] = useState<any[]>([]);
  const [rows, setRows] = useState<any[]>([]);
  const [validationRules, setValidationRules] = useState<any[]>([])

  useEffect(() => {
    setValidationRules(JSON.parse(validationOptions) ?? '[]')
  },[validationOptions])

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
              const error = params.data?.errors?.[params.column.colId];

              return (
                <div className={`${error ? 'bg-red-500 text-white' : 'text-black bg-white'}`} >
                  <div>{value}</div>
                  {error && <div style={{ fontSize: "12px" }}>{error}</div>}
                </div>
              );
            },
            cellStyle: (params: any) => {
              const error = params.data?.errors?.[params.colDef.field];
              return error
                ? { backgroundColor: "#ef4444", color: "white" }
                : { backgroundColor: 'white', color: 'black' };
            },
          }));

          const jsonRows = jsonData.map((rowData) => ({ ...rowData, errors: {} }));
          setColumns(columnDefs);
          setRows(jsonRows);
        }
      };
      reader.readAsArrayBuffer(file);
    };

    parseFile();
  }, [file]);


  const getValidatorForColumn = (columnName: string, validationRules: Rule[]) => {
    const rule = validationRules.find((rule) => rule.column === columnName);
    if (!rule) return null;

    return (params: any) => {
      const value = params.newValue;
      let errorMessage = "";

      switch (rule.type) {
        case "range":
          if (value < rule.minValue! || value > rule.maxValue!) {
            errorMessage = rule.errorMessage;
          }
          break;
        case "email":
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            errorMessage = rule.errorMessage;
          }
          break;
        case "required":
          if (!value || value.trim() === "") {
            errorMessage = rule.errorMessage;
          }
          break;
        default:
          break;
      }

      if (errorMessage) {
        return { valid: false, error: errorMessage }; // Return error errorMessage
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
          const validator = getValidatorForColumn(colDef.field ?? "", validationRules);
          if (validator) {
            const res = validator(event);
            const errors = { ...data.errors };
            if (!res.valid) {
              errors[colDef.field] = res.error; // Store error errorMessage for specific cell
            } else {
              delete errors[colDef.field]; // Clear error for specific cell if valid
            }
            data.errors = errors; // Update errors object in row
            event.api.refreshCells({ rowNodes: [event.node], force: true });
          }
        }}
        defaultColDef={defaultColDef}
        className="bg-white"
      />
    </div>
  );
}
