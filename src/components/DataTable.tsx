import { DataRow } from "@/lib/data-service";
import { useState } from "react";
import { ArrowUpDown } from "lucide-react";

interface DataTableProps {
  data: DataRow[];
}

type SortKey = keyof DataRow;
type SortOrder = "asc" | "desc";

export function DataTable({ data }: DataTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("fecha");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const sortedData = [...data].sort((a, b) => {
    const aVal = a[sortKey];
    const bVal = b[sortKey];
    
    if (typeof aVal === "number" && typeof bVal === "number") {
      return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
    }
    
    return sortOrder === "asc" 
      ? String(aVal).localeCompare(String(bVal))
      : String(bVal).localeCompare(String(aVal));
  });

  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-semibold mb-6 text-foreground">
        Detalle de Proyectos
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {["fecha", "cliente", "servicio", "estado", "valor", "canal", "equipo"].map((key) => (
                <th 
                  key={key}
                  className="text-left py-3 px-4 font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                  onClick={() => handleSort(key as SortKey)}
                >
                  <div className="flex items-center gap-2">
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                    <ArrowUpDown className="w-4 h-4" />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.slice(0, 10).map((row, index) => (
              <tr 
                key={index}
                className="border-b border-border/50 hover:bg-muted/30 transition-colors"
              >
                <td className="py-3 px-4 text-sm">{row.fecha}</td>
                <td className="py-3 px-4 text-sm font-medium">{row.cliente}</td>
                <td className="py-3 px-4 text-sm">{row.servicio}</td>
                <td className="py-3 px-4 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    row.estado === "Completado" 
                      ? "bg-primary/20 text-primary" 
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {row.estado}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm font-semibold text-primary">
                  ${row.valor.toLocaleString()}
                </td>
                <td className="py-3 px-4 text-sm">{row.canal}</td>
                <td className="py-3 px-4 text-sm">{row.equipo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
