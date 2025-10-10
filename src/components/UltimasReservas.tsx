import { DataRow } from "@/lib/data-service";
import { AlertCircle } from "lucide-react";

interface UltimasReservasProps {
  data: DataRow[];
}

export function UltimasReservas({ data }: UltimasReservasProps) {
  const tieneEspecificacionesEspeciales = (especificaciones: string) => {
    const especiales = ["sin gluten", "cumpleaños", "aniversario", "alergia"];
    return especiales.some(e => especificaciones.toLowerCase().includes(e));
  };

  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-semibold mb-6 text-foreground">
        Últimas Reservas
      </h3>
      <div className="space-y-3">
        {data.slice(0, 5).map((reserva, idx) => (
          <div 
            key={idx}
            className="flex items-start justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-foreground">{reserva.nombre}</h4>
                {tieneEspecificacionesEspeciales(reserva.especificaciones) && (
                  <AlertCircle className="w-4 h-4 text-primary" />
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {reserva.dia} • {reserva.hora} • {reserva.personas} personas
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {reserva.sucursal} - {reserva.mesa_asignada}
              </p>
              {reserva.especificaciones && (
                <p className="text-xs text-primary mt-1">
                  {reserva.especificaciones}
                </p>
              )}
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              reserva.estado === "Confirmado" 
                ? "bg-primary/20 text-primary" 
                : reserva.estado === "Pendiente"
                ? "bg-chart-4/20 text-chart-4"
                : "bg-muted text-muted-foreground"
            }`}>
              {reserva.estado}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
