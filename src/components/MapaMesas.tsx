interface MapaMesasProps {
  estadoMesas: Record<string, { ocupadas: number; libres: number }>;
}

export function MapaMesas({ estadoMesas }: MapaMesasProps) {
  const sucursales = ["Centro", "Pocitos", "Carrasco"];
  
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
              <div className="grid grid-cols-6 gap-2">
                {Array.from({ length: totalMesas }).map((_, idx) => {
                  const isOcupada = idx < estado.ocupadas;
                  return (
                    <div
                      key={idx}
                      className={`
                        aspect-square rounded-lg flex items-center justify-center text-xs font-semibold
                        transition-all duration-300 hover:scale-110
                        ${isOcupada 
                          ? 'bg-primary/20 text-primary border-2 border-primary glow-effect' 
                          : 'bg-muted/50 text-muted-foreground border border-border'
                        }
                      `}
                    >
                      {idx + 1}
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
