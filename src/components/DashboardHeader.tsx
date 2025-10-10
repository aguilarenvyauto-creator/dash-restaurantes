import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  onRefresh: () => void;
  isRefreshing: boolean;
  lastUpdated?: Date;
}

export function DashboardHeader({ onRefresh, isRefreshing, lastUpdated }: DashboardHeaderProps) {
  return (
    <header className="glass-card p-6 mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center font-bold text-primary-foreground text-xl">
              R
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                RestaurantePro
              </h1>
              <p className="text-sm text-muted-foreground">
                Sistema de Gestión de Reservas
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {lastUpdated && (
            <span className="text-sm text-muted-foreground">
              Actualizado: {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <Button
            onClick={onRefresh}
            disabled={isRefreshing}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
        </div>
      </div>
    </header>
  );
}
