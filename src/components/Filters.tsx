import { Filter, CalendarIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, addDays, startOfWeek, endOfWeek, addWeeks } from "date-fns";
import { es } from "date-fns/locale";
import { useState } from "react";
import { cn } from "@/lib/utils";

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
  const sucursales = ["La Luna", "Blue Moon", "Finca Moon"];
  const estados = ["Confirmado", "Pendiente", "Cancelado"];
  const [calendarOpen, setCalendarOpen] = useState(false);

  const today = new Date();
  const tomorrow = addDays(today, 1);
  const nextWeekStart = startOfWeek(addWeeks(today, 1), { weekStartsOn: 1 });
  const nextWeekEnd = endOfWeek(addWeeks(today, 1), { weekStartsOn: 1 });

  const handleQuickDate = (option: string) => {
    if (option === "hoy") {
      onDiaChange(format(today, "dd/MM/yyyy"));
    } else if (option === "manana") {
      onDiaChange(format(tomorrow, "dd/MM/yyyy"));
    } else if (option === "semana") {
      // For week, we'll pass a special format
      onDiaChange(`semana:${format(nextWeekStart, "dd/MM/yyyy")}-${format(nextWeekEnd, "dd/MM/yyyy")}`);
    }
  };

  const handleCalendarSelect = (date: Date | undefined) => {
    if (date) {
      onDiaChange(format(date, "dd/MM/yyyy"));
      setCalendarOpen(false);
    }
  };

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
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !selectedDia || selectedDia === "all" ? "text-muted-foreground" : ""
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDia && selectedDia !== "all" 
                  ? selectedDia.startsWith("semana:") 
                    ? "Semana que viene" 
                    : selectedDia
                  : "Seleccionar fecha"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <div className="p-3 border-b space-y-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => { handleQuickDate("hoy"); setCalendarOpen(false); }}
                >
                  Hoy ({format(today, "dd/MM/yyyy")})
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => { handleQuickDate("manana"); setCalendarOpen(false); }}
                >
                  Mañana ({format(tomorrow, "dd/MM/yyyy")})
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => { handleQuickDate("semana"); setCalendarOpen(false); }}
                >
                  La semana que viene
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-start text-muted-foreground"
                  onClick={() => { onDiaChange("all"); setCalendarOpen(false); }}
                >
                  Todos los días
                </Button>
              </div>
              <Calendar
                mode="single"
                selected={selectedDia && !selectedDia.startsWith("semana:") && selectedDia !== "all" 
                  ? new Date(selectedDia.split("/").reverse().join("-")) 
                  : undefined}
                onSelect={handleCalendarSelect}
                locale={es}
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
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