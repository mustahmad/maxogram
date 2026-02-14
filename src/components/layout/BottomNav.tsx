"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Film, Home, Plus, Search, User } from "lucide-react";
import { cn } from "@/lib/utils";
import Avatar from "@/components/ui/Avatar";
import { useAuthStore } from "@/stores/useAuthStore";

interface BottomNavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

export default function BottomNav() {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);

  const isActive = (href: string) => pathname.startsWith(href);

  const items: BottomNavItem[] = [
    { label: "Home", href: "/feed", icon: <Home size={22} /> },
    { label: "Explore", href: "/explore", icon: <Search size={22} /> },
    {
      label: "Create",
      href: "/create",
      icon: (
        <div className="bg-brand-gradient rounded-lg p-1.5">
          <Plus size={18} className="text-white" />
        </div>
      ),
    },
    { label: "Reels", href: "/reels", icon: <Film size={22} /> },
    {
      label: "Profile",
      href: `/profile/${user?.username ?? "maxo_user"}`,
      icon: user ? (
        <Avatar src={user.avatarUrl} alt={user.displayName} size="sm" className="!h-6 !w-6" />
      ) : (
        <User size={22} />
      ),
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card/95 backdrop-blur-lg safe-bottom">
      <div className="flex h-14 items-center justify-around">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-0.5 text-[10px] active:scale-95 transition-transform",
              isActive(item.href)
                ? "text-foreground"
                : "text-muted-foreground",
            )}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
