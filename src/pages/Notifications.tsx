import { useEffect, useState } from "react";
import { Bell, Heart, MessageCircle, UserPlus, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { API_BASE_URL } from "@/lib/api";
import { toast } from "sonner";
import { formatDate } from "@/lib/mockData";

type NotificationType = "like" | "comment" | "follow" | "blog";

interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  created_at: string;
  is_read: boolean;
}

const typeIcon: Record<NotificationType, React.ReactNode> = {
  like: <Heart className="h-4 w-4 text-red-500" />,
  comment: <MessageCircle className="h-4 w-4 text-blue-500" />,
  follow: <UserPlus className="h-4 w-4 text-green-500" />,
  blog: <BookOpen className="h-4 w-4 text-primary" />,
};

const Notifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const res = await fetch(`${API_BASE_URL}/notifications?user_id=${user.id}`);
      const data = await res.json();
      if (data.success) {
        setNotifications(data.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [user]);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const markAllRead = async () => {
    if (!user) return;
    try {
      const res = await fetch(`${API_BASE_URL}/notifications/read-all?user_id=${user.id}`, {
        method: "POST",
      });
      if (res.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
        toast.success("All notifications marked as read");
      }
    } catch (err) {
      toast.error("Failed to mark all as read");
    }
  };

  const markRead = async (id: string, currentlyRead: boolean) => {
    if (currentlyRead) return;
    try {
      const res = await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
        method: "POST",
      });
      if (res.ok) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
        );
      }
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto max-w-2xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="h-6 w-6 text-primary" />
            <h1 className="font-display text-2xl font-bold text-foreground">Notifications</h1>
            {unreadCount > 0 && (
              <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground">
                {unreadCount}
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllRead} className="text-muted-foreground">
              Mark all read
            </Button>
          )}
        </div>

        <div className="space-y-2">
          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 animate-pulse rounded-xl bg-secondary" />
              ))}
            </div>
          ) : notifications.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground">
              <Bell className="mx-auto mb-3 h-10 w-10 opacity-40" />
              <p>No notifications yet</p>
            </div>
          ) : (
            notifications.map((n, i) => (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => markRead(n.id, n.is_read)}
                className={cn(
                  "flex cursor-pointer items-start gap-3 rounded-xl border border-border p-4 transition-colors hover:bg-secondary/50",
                  !n.is_read && "bg-primary/5 border-primary/20"
                )}
              >
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary">
                  {typeIcon[n.type]}
                </div>
                <div className="min-w-0 flex-1">
                  <p className={cn("text-sm text-foreground", !n.is_read && "font-medium")}>
                    {n.message}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">{formatDate(n.created_at)}</p>
                </div>
                {!n.is_read && (
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" />
                )}
              </motion.div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default Notifications;
