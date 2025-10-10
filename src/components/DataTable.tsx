import { DataRow } from "@/lib/data-service";
import { useState } from "react";
import { ArrowUpDown } from "lucide-react";

interface DataTableProps {
  data: DataRow[];
}

type SortKey = keyof DataRow;
type SortOrder = "asc" | "desc";

export function DataTable({ data }: DataTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("dia");
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
        Lista Completa de Reservas
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {["nombre", "dia", "hora", "personas", "sucursal", "mesa_asignada", "especificaciones", "estado"].map((key) => (
                <th 
                  key={key}
                  className="text-left py-3 px-4 font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                  onClick={() => handleSort(key as SortKey)}
                >
                  <div className="flex items-center gap-2">
                    {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
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
                <td className="py-3 px-4 text-sm font-medium">{row.nombre}</td>
                <td className="py-3 px-4 text-sm">{row.dia}</td>
                <td className="py-3 px-4 text-sm">{row.hora}</td>
                <td className="py-3 px-4 text-sm font-semibold text-primary">{row.personas}</td>
                <td className="py-3 px-4 text-sm">{row.sucursal}</td>
                <td className="py-3 px-4 text-sm">{row.mesa_asignada}</td>
                <td className="py-3 px-4 text-sm text-muted-foreground">{row.especificaciones}</td>
                <td className="py-3 px-4 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    row.estado === "Confirmado" 
                      ? "bg-primary/20 text-primary" 
                      : row.estado === "Pendiente"
                      ? "bg-chart-4/20 text-chart-4"
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {row.estado}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
