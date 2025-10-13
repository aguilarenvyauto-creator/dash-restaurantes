import { Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface FiltersProps {
  selectedSucursal: string;
  selectedDia: string;
  selectedEstado: string;
  onSucursalChange: (value: string) => void;
  onDiaChange: (value: string) => void;
  onEstadoChange: (value: string) => void;
  onClearFilters: () => void;
  availableDias: string[];
}

export function Filters({
  selectedSucursal,
  selectedDia,
  selectedEstado,
  onSucursalChange,
  onDiaChange,
  onEstadoChange,
  onClearFilters,
  availableDias,
}: FiltersProps) {
  const sucursales = ["La luna", "Blue Moon", "Finca Moon"];
  const estados = ["Confirmado", "Pendiente", "Cancelado"];

  return (
    <div className="glass-card p-6 mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Filtros</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="text-sm text-muted-foreground mb-2 block">Sucursal</label>
          <Select value={selectedSucursal} onValueChange={onSucursalChange}>
            <SelectTrigger>
              <SelectValue placeholder="Todas las sucursales" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {sucursales.map((sucursal) => (
                <SelectItem key={sucursal} value={sucursal}>
                  {sucursal}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm text-muted-foreground mb-2 block">Día</label>
          <Select value={selectedDia} onValueChange={onDiaChange}>
            <SelectTrigger>
              <SelectValue placeholder="Todos los días" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {availableDias.map((dia) => (
                <SelectItem key={dia} value={dia}>
                  {dia}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm text-muted-foreground mb-2 block">Estado</label>
          <Select value={selectedEstado} onValueChange={onEstadoChange}>
            <SelectTrigger>
              <SelectValue placeholder="Todos los estados" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {estados.map((estado) => (
                <SelectItem key={estado} value={estado}>
                  {estado}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-end">
          <Button 
            variant="outline" 
            onClick={onClearFilters}
            className="w-full"
          >
            Limpiar Filtros
          </Button>
        </div>
      </div>
    </div>
  );
}
