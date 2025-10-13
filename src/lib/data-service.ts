import { z } from "zod";

// Schema para validar datos del CSV de reservas
export const DataRowSchema = z.object({
  nombre: z.string(),
  dia: z.string(),
  hora: z.string(),
  personas: z.coerce.number(),
  especificaciones: z.string(),
  sucursal: z.string(),
  mesa_asignada: z.string(),
  estado: z.string(),
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

  const headers = lines[0].split(",").map(h => h.trim().toLowerCase().replace(/\s+/g, "_"));
  
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
    { nombre: "Aguilar López", dia: "10/11/2025", hora: "21:30", personas: 4, especificaciones: "Mesa cómoda", sucursal: "La luna", mesa_asignada: "Mesa 4", estado: "Confirmado" },
    { nombre: "García Torres", dia: "10/11/2025", hora: "20:00", personas: 2, especificaciones: "Cena romántica", sucursal: "La luna", mesa_asignada: "Mesa 7", estado: "Confirmado" },
    { nombre: "Pérez Hernández", dia: "10/11/2025", hora: "22:00", personas: 5, especificaciones: "Cumpleaños", sucursal: "Blue Moon", mesa_asignada: "Mesa 10", estado: "Pendiente" },
    { nombre: "López Ramírez", dia: "10/11/2025", hora: "14:30", personas: 3, especificaciones: "Cerca de ventana", sucursal: "Finca Moon", mesa_asignada: "Mesa 3", estado: "Confirmado" },
    { nombre: "Ruiz González", dia: "11/11/2025", hora: "21:00", personas: 6, especificaciones: "Grupo grande", sucursal: "La luna", mesa_asignada: "Mesa 12", estado: "Confirmado" },
    { nombre: "Fernández Díaz", dia: "11/11/2025", hora: "13:00", personas: 2, especificaciones: "Menú ejecutivo", sucursal: "Blue Moon", mesa_asignada: "Mesa 2", estado: "Confirmado" },
  ];
}

export function calculateKPIs(data: DataRow[]) {
  const reservasActivas = data.filter(row => row.estado === "Confirmado").length;
  const capacidadTotal = 18; // 6 mesas por sucursal × 3 sucursales
  const ocupacionTotal = capacidadTotal > 0 ? (reservasActivas / capacidadTotal) * 100 : 0;
  
  const reservasTotales = data.length;
  const totalPersonas = data.reduce((sum, row) => sum + row.personas, 0);
  
  // Calcular días únicos
  const diasUnicos = new Set(data.map(row => row.dia)).size;
  const promedioDiario = diasUnicos > 0 ? reservasTotales / diasUnicos : 0;

  // Distribución por sucursal
  const distribucionSucursal = data.reduce((acc, row) => {
    acc[row.sucursal] = (acc[row.sucursal] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Timeline diario (reservas y personas por día)
  const timelineDiario = data.reduce((acc, row) => {
    const dia = row.dia;
    if (!acc[dia]) {
      acc[dia] = { reservas: 0, personas: 0 };
    }
    acc[dia].reservas += 1;
    acc[dia].personas += row.personas;
    return acc;
  }, {} as Record<string, { reservas: number; personas: number }>);

  // Mesas ocupadas por sucursal
  const mesasPorSucursal = data
    .filter(row => row.estado === "Confirmado")
    .reduce((acc, row) => {
      if (!acc[row.sucursal]) {
        acc[row.sucursal] = new Set();
      }
      acc[row.sucursal].add(row.mesa_asignada);
      return acc;
    }, {} as Record<string, Set<string>>);

  const estadoMesas: Record<string, { ocupadas: number; libres: number }> = {
    "La luna": { ocupadas: mesasPorSucursal["La luna"]?.size || 0, libres: 6 - (mesasPorSucursal["La luna"]?.size || 0) },
    "Blue Moon": { ocupadas: mesasPorSucursal["Blue Moon"]?.size || 0, libres: 6 - (mesasPorSucursal["Blue Moon"]?.size || 0) },
    "Finca Moon": { ocupadas: mesasPorSucursal["Finca Moon"]?.size || 0, libres: 6 - (mesasPorSucursal["Finca Moon"]?.size || 0) },
  };

  // Últimas reservas por sucursal
  const ultimasReservasPorSucursal = data
    .sort((a, b) => b.dia.localeCompare(a.dia))
    .slice(0, 5);

  return {
    ocupacionTotal,
    reservasTotales,
    totalPersonas,
    promedioDiario,
    distribucionSucursal,
    timelineDiario,
    estadoMesas,
    ultimasReservasPorSucursal,
  };
}
