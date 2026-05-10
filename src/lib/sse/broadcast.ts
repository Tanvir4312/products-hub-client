// Helper to broadcast events to the SSE feed
// This is used by Server Actions to send real-time updates

interface BroadcastEvent {
  type: "upvote" | "new_product"
  data: Record<string, any>
}

export async function broadcastEvent(event: BroadcastEvent) {
  try {
    // In production, this would call the SSE endpoint internally
    // For now, we'll make an internal API call
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000"
    
    // Send to internal SSE broadcast endpoint
    await fetch(`${baseUrl}/api/feed/broadcast`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(event),
    })
  } catch (error) {
    // Silent fail - broadcasting is best-effort
    console.error("Failed to broadcast event:", error)
  }
}
