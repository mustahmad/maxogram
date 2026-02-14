"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Compass,
  Film,
  Heart,
  Home,
  MessageCircle,
  PlusSquare,
  Settings,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import { useAuthStore } from "@/stores/useAuthStore";
import { useMessageStore } from "@/stores/useMessageStore";
import { useNotificationStore } from "@/stores/useNotificationStore";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
}

export default function Sidebar() {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const conversations = useMessageStore((s) => s.conversations);
  const unreadNotifications = useNotificationStore((s) => s.unreadCount);

  const unreadMessages = conversations.reduce(
    (sum, c) => sum + c.unreadCount,
    0,
  );

  const navItems: NavItem[] = [
    { label: "Home", href: "/feed", icon: <Home size={24} /> },
    { label: "Explore", href: "/explore", icon: <Compass size={24} /> },
    { label: "Reels", href: "/reels", icon: <Film size={24} /> },
    {
      label: "Messages",
      href: "/messages",
      icon: <MessageCircle size={24} />,
      badge: unreadMessages,
    },
    {
      label: "Notifications",
      href: "/notifications",
      icon: <Heart size={24} />,
      badge: unreadNotifications,
    },
    { label: "Create", href: "/create", icon: <PlusSquare size={24} /> },
  ];

  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <aside className="fixed left-0 top-0 z-30 flex h-full w-60 flex-col border-r border-border bg-card">
      {/* Logo */}
      <div className="px-5 py-6">
        <Link href="/feed" className="text-brand-gradient text-xl font-bold">
          Maxogram
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors",
              isActive(item.href)
                ? "bg-accent/10 text-accent"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            {item.icon}
            <span className="text-sm font-medium">{item.label}</span>
            {item.badge !== undefined && item.badge > 0 && (
              <Badge count={item.badge} className="ml-auto" />
            )}
          </Link>
        ))}

        {/* Profile */}
        <Link
          href={`/profile/${user?.username ?? "maxo_user"}`}
          className={cn(
            "flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors",
            isActive("/profile")
              ? "bg-accent/10 text-accent"
              : "text-muted-foreground hover:bg-muted hover:text-foreground",
          )}
        >
          {user ? (
            <Avatar
              src={user.avatarUrl}
              alt={user.displayName}
              size="sm"
            />
          ) : (
            <User size={24} />
          )}
          <span className="text-sm font-medium">Profile</span>
        </Link>
      </nav>

      {/* Settings */}
      <div className="px-3 pb-6">
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors",
            isActive("/settings")
              ? "bg-accent/10 text-accent"
              : "text-muted-foreground hover:bg-muted hover:text-foreground",
          )}
        >
          <Settings size={24} />
          <span className="text-sm font-medium">Settings</span>
        </Link>
      </div>
    </aside>
  );
}
