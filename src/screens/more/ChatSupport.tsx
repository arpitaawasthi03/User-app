import { useState, useRef, useEffect } from "react"
import FlowHeader from "../../components/FlowHeader"
import Icon from "../../components/Icon"
import { useNav } from "../../navigation/Navigation"
import { useApp } from "../../state/AppState"

interface ChatSupportProps {
  orderId?: string
}

type Message = {
  id: string
  sender: "agent" | "user"
  text: string
  time: string
}

export default function ChatSupport({ orderId }: ChatSupportProps) {
  const { back } = useNav()
  const { state } = useApp()

  const relatedOrder = orderId
    ? state.orders.find((o) => o.id === orderId)
    : state.orders[0]

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "m1",
      sender: "agent",
      text: `Hello ${state.profile.name || "there"}! I'm Priya from RoadRider Customer Care. How can I assist you today?`,
      time: "Just now",
    },
    ...(relatedOrder
      ? [
          {
            id: "m2",
            sender: "agent" as const,
            text: `I can see your order ${relatedOrder.id} (${relatedOrder.title}). Feel free to ask any question regarding this order or any service.`,
            time: "Just now",
          },
        ]
      : []),
  ])

  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const bottomRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping])

  const quickPrompts = [
    "Where is my driver right now?",
    "I want to change delivery address",
    "How do refunds work?",
    "Need urgent help with an order",
  ]

  const sendMessage = (text: string) => {
    if (!text.trim()) return
    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: "user",
      text: text.trim(),
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    }

    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setIsTyping(true)

    setTimeout(() => {
      let reply =
        "Thank you for sharing. Our team is monitoring this and ensuring you have a smooth experience."
      const lower = text.toLowerCase()
      if (
        lower.includes("driver") ||
        lower.includes("where") ||
        lower.includes("track")
      ) {
        reply = `Your partner is currently en route. You can check the real-time map on the status screen or call them directly via the partner card.`
      } else if (lower.includes("address") || lower.includes("location")) {
        reply =
          "To update your drop location, you can choose from your saved addresses or add a new address in the Places menu."
      } else if (
        lower.includes("refund") ||
        lower.includes("cancel") ||
        lower.includes("money")
      ) {
        reply =
          "All eligible refunds are automatically credited back to your RoadRider Wallet instantly, or to your original payment card within 2-3 business days."
      } else if (
        lower.includes("help") ||
        lower.includes("issue") ||
        lower.includes("food") ||
        lower.includes("item")
      ) {
        reply =
          "I've flagged this with our priority escalation team. A supervisor is also reviewing your order log to ensure full satisfaction."
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          sender: "agent",
          text: reply,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ])
      setIsTyping(false)
    }, 900)
  }

  return (
    <div
      className="more-page"
      style={{
        paddingBottom: 80,
        display: "flex",
        flexDirection: "column",
        minHeight: "100%",
      }}
    >
      <FlowHeader title="Live Support" onBack={back} showHelp={false} />

      <div
        style={{
          background: "#fff",
          border: "1px solid var(--line)",
          borderRadius: 16,
          padding: 12,
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 12,
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: "var(--accent-soft)",
            color: "var(--accent)",
            display: "grid",
            placeItems: "center",
            fontWeight: 700,
            fontSize: 14,
          }}
        >
          PR
        </div>
        <div style={{ flex: 1 }}>
          <strong style={{ fontSize: 12, display: "block" }}>
            Priya · RoadRider Support
          </strong>
          <span style={{ fontSize: 9, color: "#288153", fontWeight: 600 }}>
            ● Online · Replies in seconds
          </span>
        </div>
        {relatedOrder && (
          <span
            style={{
              fontSize: 9,
              padding: "4px 8px",
              background: "#f4f1ec",
              borderRadius: 6,
              fontWeight: 700,
            }}
          >
            #{relatedOrder.id}
          </span>
        )}
      </div>

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 10,
          padding: "8px 2px",
        }}
      >
        {messages.map((m) => (
          <div
            key={m.id}
            style={{
              alignSelf: m.sender === "user" ? "flex-end" : "flex-start",
              maxWidth: "82%",
              background: m.sender === "user" ? "var(--accent)" : "#ffffff",
              color: m.sender === "user" ? "#ffffff" : "var(--ink)",
              borderRadius:
                m.sender === "user"
                  ? "14px 14px 2px 14px"
                  : "14px 14px 14px 2px",
              padding: "10px 14px",
              border: m.sender === "user" ? "none" : "1px solid var(--line)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            }}
          >
            <p style={{ margin: 0, fontSize: 11, lineHeight: 1.45 }}>
              {m.text}
            </p>
            <small
              style={{
                display: "block",
                textAlign: "right",
                fontSize: 8,
                marginTop: 4,
                opacity: 0.6,
              }}
            >
              {m.time}
            </small>
          </div>
        ))}

        {isTyping && (
          <div
            style={{
              alignSelf: "flex-start",
              background: "#fff",
              border: "1px solid var(--line)",
              borderRadius: "14px 14px 14px 2px",
              padding: "8px 14px",
              fontSize: 10,
              color: "var(--muted)",
            }}
          >
            Priya is typing...
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div style={{ margin: "8px 0" }}>
        <div
          style={{
            display: "flex",
            gap: 6,
            overflowX: "auto",
            paddingBottom: 4,
            scrollbarWidth: "none",
          }}
        >
          {quickPrompts.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => sendMessage(prompt)}
              style={{
                whiteSpace: "nowrap",
                fontSize: 9,
                fontWeight: 600,
                padding: "6px 10px",
                borderRadius: 20,
                background: "#ffffff",
                border: "1px solid var(--line)",
                color: "var(--ink)",
              }}
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      <div
        style={{
          position: "sticky",
          bottom: 0,
          background: "#f7f5f2",
          paddingTop: 6,
          display: "flex",
          gap: 8,
          alignItems: "center",
        }}
      >
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage(input)
          }}
          style={{
            flex: 1,
            height: 44,
            padding: "0 14px",
            border: "1px solid var(--line)",
            borderRadius: 12,
            background: "#fff",
            fontSize: 12,
            outline: "none",
          }}
        />
        <button
          type="button"
          onClick={() => sendMessage(input)}
          disabled={!input.trim()}
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: "var(--accent)",
            color: "#fff",
            display: "grid",
            placeItems: "center",
            opacity: input.trim() ? 1 : 0.6,
          }}
        >
          <Icon name="arrow" size={18} />
        </button>
      </div>
    </div>
  )
}
