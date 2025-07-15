import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { DataGrid } from "react-data-grid";

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
          // Generate column definitions based on keys
          const firstRow = jsonData[0];
          const columnDefs = Object.keys(firstRow).map((key) => ({
            key,
            name: key,
            editable: true,
          }));
          console.log("columnDefs", columnDefs);
          setColumns(columnDefs);
          setRows(jsonData);
        }
      };
      reader.readAsArrayBuffer(file);
    };

    parseFile();
  }, [file]);

  const handleRowsChange = (updatedRows: any[]) => {
    setRows(updatedRows);
  };

  return (
    <div className="">
      {columns.length === 0 ? (
        <p className="text-gray-500">Parsing file...</p>
      ) : (
        <DataGrid
          columns={columns}
          rows={rows}
          onRowsChange={handleRowsChange}
          className="rdg-light h-[75vh] rounded-xl "
          //   rowHeight={20}
        />
      )}
    </div>
  );
}
