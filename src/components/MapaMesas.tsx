import { DataRow } from "@/lib/data-service";

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
      r.estado === "Confirmado"
    );
    return reserva;
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
              <div className="grid grid-cols-6 gap-3">
                {Array.from({ length: totalMesas }).map((_, idx) => {
                  const mesaNum = idx + 1;
                  const reserva = getMesaInfo(sucursal, mesaNum);
                  const isOcupada = !!reserva;
                  
                  return (
                    <div
                      key={idx}
                      className={`
                        relative aspect-square rounded-xl flex flex-col items-center justify-center text-xs font-semibold
                        transition-all duration-300 hover:scale-105 cursor-pointer
                        shadow-lg
                        ${isOcupada 
                          ? 'bg-red-500/90 text-white border-2 border-red-600' 
                          : 'bg-green-500/90 text-white border-2 border-green-600'
                        }
                      `}
                      style={{
                        clipPath: "polygon(10% 0%, 90% 0%, 100% 10%, 100% 90%, 90% 100%, 10% 100%, 0% 90%, 0% 10%)"
                      }}
                      title={reserva ? `${reserva.nombre} - ${reserva.personas} personas` : 'Disponible'}
                    >
                      <span className="text-base font-bold">{mesaNum}</span>
                      {isOcupada && reserva && (
                        <span className="text-xs mt-1">👥 {reserva.personas}</span>
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
