import { useEffect, useState } from "react";
import { DollarSign, Users, TrendingUp, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { fetchCSVData, calculateKPIs, DataRow } from "@/lib/data-service";
import { DashboardHeader } from "@/components/DashboardHeader";
import { KPICard } from "@/components/KPICard";
import { ServiceDistributionChart } from "@/components/ServiceDistributionChart";
import { TimelineChart } from "@/components/TimelineChart";
import { ChannelDistributionChart } from "@/components/ChannelDistributionChart";
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
            title="Ingresos Totales"
            value={kpis.totalIngresos}
            icon={DollarSign}
            trend="+12.5%"
            suffix=""
            animated
          />
          <KPICard
            title="Clientes Activos"
            value={kpis.clientesUnicos}
            icon={Users}
            trend="+8.2%"
            animated
          />
          <KPICard
            title="Proyectos Completados"
            value={kpis.proyectosCompletados}
            icon={CheckCircle}
            animated
          />
          <KPICard
            title="Tasa de Conversión"
            value={kpis.tasaConversion.toFixed(1)}
            icon={TrendingUp}
            suffix="%"
            animated
          />
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <TimelineChart data={kpis.timelineMensual} />
          <ServiceDistributionChart data={kpis.distribucionServicio} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ChannelDistributionChart data={kpis.distribucionCanal} />
          <div className="glass-card p-6 flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-4xl font-bold text-primary glow-text mb-2">
                {kpis.totalIngresos.toLocaleString("es-ES", {
                  style: "currency",
                  currency: "USD",
                  minimumFractionDigits: 0,
                })}
              </h3>
              <p className="text-muted-foreground">Ingresos del Mes</p>
              <p className="text-sm text-primary mt-2">+15.3% vs mes anterior</p>
            </div>
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
