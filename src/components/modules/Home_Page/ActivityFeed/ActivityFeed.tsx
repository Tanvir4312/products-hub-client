"use client"

import React, { useEffect, useState, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, Rocket, Wifi, WifiOff, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface ActivityEvent {
  id: string
  type: "upvote" | "new_product"
  data: {
    productName?: string
    productId?: string
    userName?: string
    timestamp: string
    [key: string]: any
  }
}

const ActivityFeed = () => {
  const [events, setEvents] = useState<ActivityEvent[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [reconnectAttempt, setReconnectAttempt] = useState(0)
  const eventSourceRef = useRef<EventSource | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const connect = useCallback(() => {
    // Close existing connection
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
    }

    const eventSource = new EventSource("/api/feed")
    eventSourceRef.current = eventSource

    eventSource.onopen = () => {
      setIsConnected(true)
      setReconnectAttempt(0)
    }

    eventSource.onmessage = (event) => {
      // Handle heartbeat comments (start with :)
      if (event.data.startsWith("heartbeat")) return

      try {
        const data = JSON.parse(event.data)
        
        // Skip connection confirmation messages
        if (data.message === "Connected to activity feed") return

        const newEvent: ActivityEvent = {
          id: `${Date.now()}-${Math.random()}`,
          type: event.type as "upvote" | "new_product",
          data: {
            ...data,
            timestamp: data.timestamp || new Date().toISOString(),
          },
        }

        setEvents((prev) => {
          const updated = [newEvent, ...prev].slice(0, 10) // Keep only last 10
          return updated
        })
      } catch (error) {
        console.error("Error parsing SSE message:", error)
      }
    }

    eventSource.addEventListener("upvote", (event) => {
      try {
        const data = JSON.parse(event.data)
        const newEvent: ActivityEvent = {
          id: `${Date.now()}-${Math.random()}`,
          type: "upvote",
          data: {
            ...data,
            timestamp: data.timestamp || new Date().toISOString(),
          },
        }
        setEvents((prev) => [newEvent, ...prev].slice(0, 10))
      } catch (error) {
        console.error("Error parsing upvote event:", error)
      }
    })

    eventSource.addEventListener("new_product", (event) => {
      try {
        const data = JSON.parse(event.data)
        const newEvent: ActivityEvent = {
          id: `${Date.now()}-${Math.random()}`,
          type: "new_product",
          data: {
            ...data,
            timestamp: data.timestamp || new Date().toISOString(),
          },
        }
        setEvents((prev) => [newEvent, ...prev].slice(0, 10))
      } catch (error) {
        console.error("Error parsing new_product event:", error)
      }
    })

    eventSource.onerror = () => {
      setIsConnected(false)
      eventSource.close()

      // Exponential backoff for reconnection
      const backoffTime = Math.min(1000 * Math.pow(2, reconnectAttempt), 30000)
      setReconnectAttempt((prev) => prev + 1)

      reconnectTimeoutRef.current = setTimeout(() => {
        connect()
      }, backoffTime)
    }
  }, [reconnectAttempt])

  useEffect(() => {
    connect()

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
    }
  }, [connect])

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diff < 60) return "Just now"
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    return `${Math.floor(diff / 86400)}d ago`
  }

  return (
    <div className="w-full">
      <div className="bg-background border border-border rounded-[2rem] overflow-hidden shadow-xl shadow-muted/30">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={cn(
              "w-2 h-2 rounded-full transition-colors",
              isConnected ? "bg-green-500 animate-pulse" : "bg-red-500"
            )} />
            <h3 className="text-sm font-black uppercase tracking-wider">
              Live Activity
            </h3>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            {isConnected ? (
              <>
                <Wifi className="w-3.5 h-3.5 text-green-500" />
                <span className="text-green-600 font-medium">Live</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5 text-red-500" />
                <span className="text-red-600 font-medium">
                  {reconnectAttempt > 0 ? "Reconnecting..." : "Offline"}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Events Grid */}
        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-h-[400px] overflow-y-auto">
          <AnimatePresence mode="popLayout">
            {events.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8 text-muted-foreground"
              >
                <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-xs font-medium">Waiting for activity...</p>
              </motion.div>
            ) : (
              events.map((event) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -20, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 20, scale: 0.95 }}
                  layout
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-2xl transition-colors",
                    event.type === "upvote" 
                      ? "bg-primary/5 hover:bg-primary/10" 
                      : "bg-indigo-500/5 hover:bg-indigo-500/10"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                    event.type === "upvote"
                      ? "bg-primary/10 text-primary"
                      : "bg-indigo-500/10 text-indigo-600"
                  )}>
                    {event.type === "upvote" ? (
                      <Heart className="w-5 h-5 fill-current" />
                    ) : (
                      <Rocket className="w-5 h-5" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {event.type === "upvote" ? (
                        <>
                          <span className="text-primary font-bold">
                            {event.data.userName || "Someone"}
                          </span>
                          {" "}upvoted{" "}
                          <span className="font-semibold">
                            {event.data.productName || "a product"}
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="text-indigo-600 font-bold">
                            {event.data.productName || "New product"}
                          </span>
                          {" "}just launched
                        </>
                      )}
                    </p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">
                      {formatTime(event.data.timestamp)}
                    </p>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-border/50 bg-muted/30">
          <p className="text-[10px] text-muted-foreground text-center uppercase tracking-wider">
            Real-time updates • {events.length} events
          </p>
        </div>
      </div>
    </div>
  )
}

export default ActivityFeed
