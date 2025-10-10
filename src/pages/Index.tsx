import { useEffect, useState } from "react";
import { Users, Calendar, TrendingUp, Percent } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { fetchCSVData, calculateKPIs, DataRow } from "@/lib/data-service";
import { DashboardHeader } from "@/components/DashboardHeader";
import { KPICard } from "@/components/KPICard";
import { ServiceDistributionChart } from "@/components/ServiceDistributionChart";
import { TendenciaDiariaChart } from "@/components/TendenciaDiariaChart";
import { MapaMesas } from "@/components/MapaMesas";
import { UltimasReservas } from "@/components/UltimasReservas";
import { DataTable } from "@/components/DataTable";
import { Chatbot } from "@/components/Chatbot";

const Index = () => {
  const [data, setData] = useState<DataRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>();
  const { toast } = useToast();

  const loadData = async () => {
    setIsLoading(true);
    try {
      const fetchedData = await fetchCSVData();
      setData(fetchedData);
      setLastUpdated(new Date());
      toast({
        title: "Datos actualizados",
        description: "El dashboard se ha actualizado correctamente",
      });
    } catch (error) {
      toast({
        title: "Error al cargar datos",
        description: "Se están mostrando datos de ejemplo",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // Auto-refresh cada 30 segundos
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const kpis = calculateKPIs(data);

  return (
    <div className="min-h-screen bg-background p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <DashboardHeader 
          onRefresh={loadData}
          isRefreshing={isLoading}
          lastUpdated={lastUpdated}
        />

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KPICard
            title="Ocupación Total"
            value={kpis.ocupacionTotal.toFixed(1)}
            icon={Percent}
            trend="+12%"
            suffix="%"
            animated
          />
          <KPICard
            title="Reservas Totales"
            value={kpis.reservasTotales}
            icon={Calendar}
            trend="+8.2%"
            animated
          />
          <KPICard
            title="Total Personas"
            value={kpis.totalPersonas}
            icon={Users}
            animated
          />
          <KPICard
            title="Promedio Diario"
            value={kpis.promedioDiario.toFixed(1)}
            icon={TrendingUp}
            animated
          />
        </div>

        {/* Gráficos principales */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <TendenciaDiariaChart data={kpis.timelineDiario} />
          <ServiceDistributionChart data={kpis.distribucionSucursal} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <MapaMesas estadoMesas={kpis.estadoMesas} />
          <UltimasReservas data={data} />
        </div>

        {/* Widget Principal */}
        <div className="glass-card p-6 mb-8 flex items-center justify-center">
          <div className="text-center">
            <h3 className="text-4xl font-bold text-primary glow-text mb-2">
              {kpis.reservasTotales} Reservas
            </h3>
            <p className="text-muted-foreground">Total del Período</p>
            <p className="text-sm text-primary mt-2">+15% vs período anterior</p>
          </div>
        </div>

        {/* Tabla de datos */}
        <DataTable data={data} />

        {/* Chatbot */}
        <Chatbot />
      </div>
    </div>
  );
};

export default Index;
