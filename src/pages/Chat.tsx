import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Send, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockChatMessages } from "@/data/mockData";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/types";

const Chat = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>(mockChatMessages);
  const [newMessage, setNewMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!newMessage.trim()) return;
    const msg: ChatMessage = {
      id: String(messages.length + 1),
      senderId: "me",
      senderName: "You",
      text: newMessage.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
      isMe: true,
    };
    setMessages((prev) => [...prev, msg]);
    setNewMessage("");

    // Simulate auto-reply
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: String(prev.length + 1),
          senderId: "deliver1",
          senderName: "Taro",
          text: "Got it! I'll be there soon 😊",
          timestamp: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
          isMe: false,
        },
      ]);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/90 backdrop-blur-md px-4 py-3">
        <div className="mx-auto flex max-w-md items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-foreground p-1">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center text-sm">🧑</div>
          <div className="flex-1">
            <h1 className="text-base font-display font-bold leading-tight">Taro</h1>
            <p className="text-[10px] text-muted-foreground">Shopping at Fresh Mart</p>
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="rounded-full"
            onClick={() => navigate("/tracking/1")}
          >
            <MapPin className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        <div className="mx-auto max-w-md space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn("flex", msg.isMe ? "justify-end" : "justify-start")}
            >
              <div
                className={cn(
                  "max-w-[75%] rounded-2xl px-4 py-2.5 animate-fade-in",
                  msg.isMe
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "glass-card rounded-bl-md"
                )}
              >
                <p className="text-sm">{msg.text}</p>
                <p className={cn(
                  "text-[10px] mt-1",
                  msg.isMe ? "text-primary-foreground/60" : "text-muted-foreground"
                )}>
                  {msg.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-border bg-card/95 backdrop-blur-md p-3">
        <div className="mx-auto max-w-md flex gap-2">
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="rounded-full bg-muted"
          />
          <Button
            size="icon"
            className="rounded-full shrink-0"
            onClick={handleSend}
            disabled={!newMessage.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
