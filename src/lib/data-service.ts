import { z } from "zod";

// Schema para validar datos del CSV
export const DataRowSchema = z.object({
  fecha: z.string(),
  cliente: z.string(),
  servicio: z.string(),
  estado: z.string(),
  valor: z.coerce.number(),
  canal: z.string(),
  equipo: z.string(),
});

export type DataRow = z.infer<typeof DataRowSchema>;

// URL del CSV - configurar con tu Google Sheets
const CSV_URL = "https://docs.google.com/spreadsheets/d/1yZREsVNLRiHjzmocJm7otDF8fubisLuCaOwvA3ijwao/export?format=csv";

export async function fetchCSVData(): Promise<DataRow[]> {
  try {
    const response = await fetch(CSV_URL, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Error fetching CSV: ${response.statusText}`);
    }

    const text = await response.text();
    const rows = parseCSV(text);
    
    // Validar y transformar datos
    const validatedData = rows
      .map(row => {
        try {
          return DataRowSchema.parse(row);
        } catch (e) {
          console.error("Invalid row:", row, e);
          return null;
        }
      })
      .filter((row): row is DataRow => row !== null);

    return validatedData;
  } catch (error) {
    console.error("Error fetching data:", error);
    // Retornar datos de ejemplo en caso de error
    return getMockData();
  }
}

function parseCSV(text: string): Record<string, string>[] {
  const lines = text.trim().split("\n");
  if (lines.length < 2) return [];

  const headers = lines[0].split(",").map(h => h.trim().toLowerCase());
  
  return lines.slice(1).map(line => {
    const values = line.split(",").map(v => v.trim());
    const row: Record<string, string> = {};
    
    headers.forEach((header, index) => {
      row[header] = values[index] || "";
    });
    
    return row;
  });
}

// Datos de ejemplo para desarrollo
function getMockData(): DataRow[] {
  return [
    { fecha: "2025-01", cliente: "Tech Corp", servicio: "SEO", estado: "Completado", valor: 3500, canal: "Orgánico", equipo: "Marketing" },
    { fecha: "2025-01", cliente: "StartupX", servicio: "Redes Sociales", estado: "En Progreso", valor: 2800, canal: "Social", equipo: "Contenido" },
    { fecha: "2025-01", cliente: "EcommY", servicio: "Diseño Web", estado: "Completado", valor: 5200, canal: "Directo", equipo: "Diseño" },
    { fecha: "2025-02", cliente: "BrandZ", servicio: "SEO", estado: "Completado", valor: 4100, canal: "Orgánico", equipo: "Marketing" },
    { fecha: "2025-02", cliente: "LocalBiz", servicio: "Marketing Digital", estado: "En Progreso", valor: 3300, canal: "Paid", equipo: "Marketing" },
    { fecha: "2025-02", cliente: "GlobalInc", servicio: "Redes Sociales", estado: "Completado", valor: 2900, canal: "Social", equipo: "Contenido" },
    { fecha: "2025-03", cliente: "FastGrow", servicio: "Diseño Web", estado: "Completado", valor: 6800, canal: "Directo", equipo: "Diseño" },
    { fecha: "2025-03", cliente: "TechStart", servicio: "SEO", estado: "En Progreso", valor: 3700, canal: "Orgánico", equipo: "Marketing" },
    { fecha: "2025-03", cliente: "MarketPro", servicio: "Marketing Digital", estado: "Completado", valor: 4500, canal: "Paid", equipo: "Marketing" },
    { fecha: "2025-04", cliente: "InnovateCo", servicio: "Redes Sociales", estado: "Completado", valor: 3100, canal: "Social", equipo: "Contenido" },
  ];
}

export function calculateKPIs(data: DataRow[]) {
  const totalIngresos = data.reduce((sum, row) => sum + row.valor, 0);
  const clientesUnicos = new Set(data.map(row => row.cliente)).size;
  const proyectosCompletados = data.filter(row => row.estado === "Completado").length;
  const tasaConversion = data.length > 0 ? (proyectosCompletados / data.length) * 100 : 0;

  // Distribución por servicio
  const distribucionServicio = data.reduce((acc, row) => {
    acc[row.servicio] = (acc[row.servicio] || 0) + row.valor;
    return acc;
  }, {} as Record<string, number>);

  // Timeline mensual
  const timelineMensual = data.reduce((acc, row) => {
    const mes = row.fecha;
    acc[mes] = (acc[mes] || 0) + row.valor;
    return acc;
  }, {} as Record<string, number>);

  // Distribución por canal
  const distribucionCanal = data.reduce((acc, row) => {
    acc[row.canal] = (acc[row.canal] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    totalIngresos,
    clientesUnicos,
    proyectosCompletados,
    tasaConversion,
    distribucionServicio,
    timelineMensual,
    distribucionCanal,
  };
}
