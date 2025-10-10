import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "agent";
  content: string;
  timestamp: Date;
}

const WEBHOOK_URL = "https://webhook.site/unique-url"; // Usuario debe reemplazar

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Mensaje "escribiendo..."
    const typingId = Date.now();
    setMessages(prev => [...prev, {
      role: "agent",
      content: "escribiendo...",
      timestamp: new Date(),
    }]);

    try {
      const response = await fetch("/api/chat-proxy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage.content,
          timestamp: userMessage.timestamp.toISOString(),
          dashboard_context: "analytics_dashboard",
          user_session: `session_${Date.now()}`,
        }),
        signal: AbortSignal.timeout(30000),
      });

      if (!response.ok) {
        throw new Error(`Error del servidor: ${response.status}`);
      }

      const contentType = response.headers.get("content-type");
      let agentMessage = "No recibí contenido para mostrar.";

      if (contentType?.includes("application/json")) {
        const data = await response.json();
        // Extraer mensaje según prioridad
        agentMessage = 
          data.output || 
          data.message || 
          data.data?.message ||
          data.result?.message ||
          data.choices?.[0]?.message?.content ||
          (Array.isArray(data) && data[0]?.message) ||
          (Array.isArray(data) && data[0]?.text) ||
          "No recibí contenido para mostrar.";
      } else {
        agentMessage = await response.text();
      }

      // Reemplazar "escribiendo..." con respuesta real
      setMessages(prev => prev.slice(0, -1).concat({
        role: "agent",
        content: agentMessage,
        timestamp: new Date(),
      }));
    } catch (error: any) {
      console.error("Error en chatbot:", error);
      
      let errorMessage = "No pude obtener respuesta del agente. Reintentá o probá más tarde.";
      
      if (error.name === "AbortError") {
        errorMessage = "La solicitud tomó demasiado tiempo. Intentá nuevamente.";
      }

      setMessages(prev => prev.slice(0, -1).concat({
        role: "agent",
        content: errorMessage,
        timestamp: new Date(),
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Botón flotante */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg glow-effect hover:scale-110 transition-transform z-50"
          size="icon"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      )}

      {/* Ventana de chat */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] glass-card flex flex-col shadow-2xl z-50 animate-scale-in">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Asistente Virtual</h3>
                <p className="text-xs text-muted-foreground">Siempre disponible</p>
              </div>
            </div>
            <Button
              onClick={() => setIsOpen(false)}
              variant="ghost"
              size="icon"
              className="h-8 w-8"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Mensajes */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground text-sm py-8">
                ¡Hola! ¿En qué puedo ayudarte con el dashboard?
              </div>
            )}
            
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={cn(
                  "flex",
                  msg.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-2 text-sm",
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  )}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Escribe tu mensaje..."
                className="resize-none min-h-[44px] max-h-32"
                rows={1}
                disabled={isLoading}
                aria-label="Mensaje del chat"
                maxLength={2000}
              />
              <Button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                size="icon"
                className="shrink-0"
                aria-label="Enviar mensaje"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Enter para enviar, Shift+Enter para nueva línea
            </p>
          </div>
        </div>
      )}
    </>
  );
}
