import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface ServiceDistributionChartProps {
  data: Record<string, number>;
}

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

export function ServiceDistributionChart({ data }: ServiceDistributionChartProps) {
  const chartData = Object.entries(data).map(([name, value]) => ({
    name,
    value,
  }));

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-semibold mb-6 text-foreground">
        Distribución por Sucursales
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={100}
            fill="hsl(var(--primary))"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--popover))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "0.5rem",
              color: "hsl(var(--foreground))",
            }}
            formatter={(value: number) => [
              `${value} reservas (${((value / total) * 100).toFixed(1)}%)`,
              "Total"
            ]}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            wrapperStyle={{
              color: "hsl(var(--foreground))",
              fontSize: "14px"
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
