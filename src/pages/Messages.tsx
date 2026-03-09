import { useState } from "react";
import { MessageSquare, Send, Search, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
}

interface Message {
  id: string;
  text: string;
  sender: "me" | "them";
  time: string;
}

const mockConversations: Conversation[] = [
  { id: "1", name: "Sarah Chen", lastMessage: "Loved your latest blog post!", time: "2 min ago", unread: 2, online: true },
  { id: "2", name: "Alex Rivera", lastMessage: "Sure, let's collaborate on that", time: "1 hr ago", unread: 0, online: true },
  { id: "3", name: "Mike Johnson", lastMessage: "Thanks for the feedback", time: "3 hrs ago", unread: 1, online: false },
  { id: "4", name: "Emma Wilson", lastMessage: "When is your next article?", time: "1 day ago", unread: 0, online: false },
  { id: "5", name: "Chris Lee", lastMessage: "Great insights on React patterns", time: "2 days ago", unread: 0, online: true },
];

const mockMessages: Record<string, Message[]> = {
  "1": [
    { id: "1", text: "Hey! I just read your blog on Go concurrency", sender: "them", time: "10:30 AM" },
    { id: "2", text: "Thanks Sarah! Glad you liked it", sender: "me", time: "10:32 AM" },
    { id: "3", text: "The goroutine section was really helpful", sender: "them", time: "10:33 AM" },
    { id: "4", text: "Loved your latest blog post!", sender: "them", time: "10:35 AM" },
  ],
  "2": [
    { id: "1", text: "Hey Alex, want to write a collab article?", sender: "me", time: "9:00 AM" },
    { id: "2", text: "Sure, let's collaborate on that", sender: "them", time: "9:15 AM" },
  ],
  "3": [
    { id: "1", text: "Your TypeScript tips were great Mike", sender: "me", time: "Yesterday" },
    { id: "2", text: "Thanks for the feedback", sender: "them", time: "Yesterday" },
  ],
};

const Messages = () => {
  const { user } = useAuth();
  const [conversations] = useState(mockConversations);
  const [selectedConvo, setSelectedConvo] = useState<Conversation | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState(mockMessages);

  const filtered = conversations.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentMessages = selectedConvo ? messages[selectedConvo.id] || [] : [];

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedConvo) return;
    const msg: Message = {
      id: Date.now().toString(),
      text: newMessage.trim(),
      sender: "me",
      time: "Just now",
    };
    setMessages((prev) => ({
      ...prev,
      [selectedConvo.id]: [...(prev[selectedConvo.id] || []), msg],
    }));
    setNewMessage("");
  };

  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="container mx-auto flex flex-1 overflow-hidden px-4 py-6" style={{ maxHeight: "calc(100vh - 4rem)" }}>
        <div className="flex w-full overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          {/* Sidebar */}
          <div className={cn(
            "w-full flex-col border-r border-border md:flex md:w-80",
            selectedConvo ? "hidden" : "flex"
          )}>
            <div className="border-b border-border p-4">
              <div className="mb-3 flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                <h2 className="font-display text-lg font-bold text-foreground">Messages</h2>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-9 bg-secondary pl-9 text-sm"
                />
              </div>
            </div>
            <ScrollArea className="flex-1">
              {filtered.length === 0 ? (
                <div className="px-4 py-10 text-center text-sm text-muted-foreground">No conversations found</div>
              ) : (
                filtered.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedConvo(c)}
                    className={cn(
                      "flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-secondary/50",
                      selectedConvo?.id === c.id && "bg-secondary"
                    )}
                  >
                    <div className="relative">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 text-xs font-bold text-primary-foreground">
                        {getInitials(c.name)}
                      </div>
                      {c.online && (
                        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-card bg-green-500" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="truncate text-sm font-semibold text-foreground">{c.name}</p>
                        <span className="shrink-0 text-xs text-muted-foreground">{c.time}</span>
                      </div>
                      <p className="truncate text-xs text-muted-foreground">{c.lastMessage}</p>
                    </div>
                    {c.unread > 0 && (
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                        {c.unread}
                      </span>
                    )}
                  </button>
                ))
              )}
            </ScrollArea>
          </div>

          {/* Chat area */}
          <div className={cn(
            "flex-1 flex-col",
            selectedConvo ? "flex" : "hidden md:flex"
          )}>
            {selectedConvo ? (
              <>
                <div className="flex items-center gap-3 border-b border-border px-4 py-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 md:hidden"
                    onClick={() => setSelectedConvo(null)}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <div className="relative">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 text-xs font-bold text-primary-foreground">
                      {getInitials(selectedConvo.name)}
                    </div>
                    {selectedConvo.online && (
                      <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-card bg-green-500" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{selectedConvo.name}</p>
                    <p className="text-xs text-muted-foreground">{selectedConvo.online ? "Online" : "Offline"}</p>
                  </div>
                </div>

                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-3">
                    {currentMessages.map((m, i) => (
                      <motion.div
                        key={m.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className={cn("flex", m.sender === "me" ? "justify-end" : "justify-start")}
                      >
                        <div
                          className={cn(
                            "max-w-[75%] rounded-2xl px-4 py-2.5",
                            m.sender === "me"
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary text-foreground"
                          )}
                        >
                          <p className="text-sm">{m.text}</p>
                          <p className={cn(
                            "mt-1 text-[10px]",
                            m.sender === "me" ? "text-primary-foreground/60" : "text-muted-foreground"
                          )}>{m.time}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>

                <div className="border-t border-border p-4">
                  <form
                    onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
                    className="flex items-center gap-2"
                  >
                    <Input
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1 bg-secondary"
                    />
                    <Button type="submit" size="icon" disabled={!newMessage.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center text-muted-foreground">
                <MessageSquare className="mb-3 h-12 w-12 opacity-30" />
                <p className="text-sm">Select a conversation to start messaging</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Messages;
