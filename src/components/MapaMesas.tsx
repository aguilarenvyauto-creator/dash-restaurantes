import { DataRow } from "@/lib/data-service";
import { Users } from "lucide-react";

interface MapaMesasProps {
  estadoMesas: Record<string, { ocupadas: number; libres: number }>;
  reservas: DataRow[];
}

export function MapaMesas({ estadoMesas, reservas }: MapaMesasProps) {
  const sucursales = ["La luna", "Blue Moon", "Finca Moon"];
  
  // Obtener info de cada mesa
  const getMesaInfo = (sucursal: string, mesaNum: number) => {
    const mesaNombre = `Mesa ${mesaNum}`;
    const reserva = reservas.find(
      r => r.sucursal === sucursal && 
      r.mesa_asignada === mesaNombre && 
      (r.estado === "Confirmado" || r.estado === "Bloqueado" || r.estado === "Pendiente")
    );
    return reserva;
  };
  
  const isBloqueada = (reserva: DataRow | undefined) => {
    return reserva?.estado === "Bloqueado";
  };
  
  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-semibold mb-6 text-foreground">
        Mapa de Mesas
      </h3>
      <div className="space-y-6">
        {sucursales.map((sucursal) => {
          const estado = estadoMesas[sucursal] || { ocupadas: 0, libres: 6 };
          const totalMesas = 6;
          
          return (
            <div key={sucursal} className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-foreground">{sucursal}</h4>
                <span className="text-sm text-muted-foreground">
                  {estado.ocupadas}/{totalMesas} ocupadas
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {Array.from({ length: totalMesas }).map((_, idx) => {
                  const mesaNum = idx + 1;
                  const reserva = getMesaInfo(sucursal, mesaNum);
                  const isOcupada = !!reserva;
                  const isSinAsignar = !reserva;
                  const isGrupoGrande = reserva && reserva.personas > 6;
                  
                  const bloqueada = isBloqueada(reserva);
                  
                  // Determinar color: gris si bloqueada, azul si +6 personas, rojo si ocupada, verde si libre
                  let bgColor = 'bg-primary/90 border-primary';
                  let textColor = 'text-primary-foreground';
                  if (bloqueada) {
                    bgColor = 'bg-gray-500/90 border-gray-600';
                    textColor = 'text-white';
                  } else if (isGrupoGrande) {
                    bgColor = 'bg-blue-500/90 border-blue-600';
                    textColor = 'text-white';
                  } else if (isOcupada) {
                    bgColor = 'bg-red-500/90 border-red-600';
                    textColor = 'text-white';
                  }
                  
                  return (
                    <div
                      key={idx}
                      className={`
                        relative rounded-2xl flex flex-col items-center justify-center p-3 h-40
                        transition-all duration-300 hover:scale-105 cursor-pointer
                        shadow-lg border-2 ${bgColor} ${textColor}
                      `}
                      title={bloqueada ? 'Mesa Bloqueada' : reserva ? `${reserva.nombre} - ${reserva.personas} personas - ${reserva.hora}` : 'Disponible'}
                    >
                      {/* Icono de mesa */}
                      <div className="mb-2">
                        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="drop-shadow">
                          <ellipse cx="20" cy="20" rx="16" ry="12" fill="currentColor" opacity="0.9"/>
                          <rect x="18" y="28" width="4" height="8" fill="currentColor" opacity="0.8"/>
                        </svg>
                      </div>
                      
                      <span className="text-sm font-bold mb-1">Mesa {mesaNum}</span>
                      
                      {bloqueada ? (
                        <span className="text-xs font-semibold">Bloqueada</span>
                      ) : isOcupada && reserva ? (
                        <div className="text-center text-xs space-y-1">
                          <div className="flex items-center justify-center gap-1">
                            <Users size={12} />
                            <span>{reserva.personas}</span>
                          </div>
                          <div className="font-semibold">{reserva.hora}</div>
                          <div className="font-medium truncate max-w-full px-1">{reserva.nombre}</div>
                        </div>
                      ) : (
                        <span className="text-xs">Disponible</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
