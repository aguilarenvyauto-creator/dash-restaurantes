import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface TendenciaDiariaChartProps {
  data: Record<string, { reservas: number; personas: number }>;
}

export function TendenciaDiariaChart({ data }: TendenciaDiariaChartProps) {
  const chartData = Object.entries(data)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([dia, valores]) => ({
      dia,
      reservas: valores.reservas,
      personas: valores.personas,
    }));

  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-semibold mb-6 text-foreground">
        Tendencia de Reservas Diarias
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis 
            dataKey="dia" 
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
          />
          <YAxis 
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--popover))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "0.5rem",
              color: "hsl(var(--foreground))",
            }}
          />
          <Legend 
            wrapperStyle={{ 
              color: "hsl(var(--foreground))",
              fontSize: "14px"
            }}
          />
          <Line 
            type="monotone" 
            dataKey="reservas" 
            stroke="hsl(var(--chart-2))" 
            strokeWidth={3}
            dot={{ fill: "hsl(var(--chart-2))", r: 6 }}
            name="Reservas"
          />
          <Line 
            type="monotone" 
            dataKey="personas" 
            stroke="hsl(var(--primary))" 
            strokeWidth={3}
            dot={{ fill: "hsl(var(--primary))", r: 6 }}
            name="Personas"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
