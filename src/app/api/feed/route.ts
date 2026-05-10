import { NextRequest } from "next/server"

// In-memory store for connected clients
const clients = new Set<ReadableStreamDefaultController>()

// SSE headers
const sseHeaders = {
  "Content-Type": "text/event-stream",
  "Cache-Control": "no-cache",
  "Connection": "keep-alive",
}

// Broadcast message to all connected clients
export const broadcastEvent = (event: { type: string; data: any }) => {
  const message = `event: ${event.type}\ndata: ${JSON.stringify(event.data)}\n\n`
  
  clients.forEach((controller) => {
    try {
      controller.enqueue(new TextEncoder().encode(message))
    } catch (error) {
      // Client disconnected
      clients.delete(controller)
    }
  })
}

export async function GET(req: NextRequest) {
  const stream = new ReadableStream({
    start(controller) {
      // Add client to set
      clients.add(controller)
      
      // Send initial connection message
      const message = `event: connected\ndata: ${JSON.stringify({ message: "Connected to activity feed" })}\n\n`
      controller.enqueue(new TextEncoder().encode(message))
      
      // Heartbeat to keep connection alive
      const heartbeat = setInterval(() => {
        try {
          controller.enqueue(new TextEncoder().encode(`: heartbeat\n\n`))
        } catch {
          clearInterval(heartbeat)
          clients.delete(controller)
        }
      }, 30000) // Every 30 seconds
      
      // Cleanup on close
      req.signal.addEventListener("abort", () => {
        clearInterval(heartbeat)
        clients.delete(controller)
      })
    },
    cancel(controller) {
      clients.delete(controller)
    },
  })

  return new Response(stream, { headers: sseHeaders })
}

// POST endpoint for internal broadcasting
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { type, data } = body
    
    if (!type || !data) {
      return new Response(
        JSON.stringify({ error: "Missing type or data" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      )
    }
    
    broadcastEvent({ type, data })
    
    return new Response(
      JSON.stringify({ success: true, clients: clients.size }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Invalid JSON" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    )
  }
}

// Export for use in other routes
export const dynamic = "force-dynamic"
