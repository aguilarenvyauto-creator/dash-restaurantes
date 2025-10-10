// Este archivo es un placeholder para el proxy del chatbot
// En un entorno de producción, esto debería ser un endpoint de servidor real

export default async function handler(req: any, res: any) {
  if (req.method === "OPTIONS") {
    res.status(200).json({ ok: true });
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const WEBHOOK_URL = process.env.WEBHOOK_URL || "https://webhook.site/unique-url";
    
    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
      signal: AbortSignal.timeout(28000),
    });

    if (!response.ok) {
      throw new Error(`Webhook error: ${response.status}`);
    }

    const contentType = response.headers.get("content-type");
    
    if (contentType?.includes("application/json")) {
      const data = await response.json();
      res.status(200).json(data);
    } else {
      const text = await response.text();
      res.status(200).json({ message: text });
    }
  } catch (error: any) {
    console.error("Proxy error:", error);
    res.status(500).json({ 
      error: "Error al conectar con el webhook",
      message: error.message 
    });
  }
}
