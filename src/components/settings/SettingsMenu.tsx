"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  User,
  Palette,
  Lock,
  Bell,
  Info,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import { cn } from "@/lib/utils";

interface MenuItem {
  label: string;
  icon: React.ElementType;
  href?: string;
  danger?: boolean;
  action?: () => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.25 } },
};

export default function SettingsMenu() {
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();

  const menuItems: MenuItem[] = [
    { label: "Edit Profile", icon: User, href: "/settings/edit-profile" },
    { label: "Theme", icon: Palette, href: "/settings/theme" },
    { label: "Privacy", icon: Lock, href: "/settings/privacy" },
    { label: "Notifications", icon: Bell },
    { label: "About", icon: Info },
    {
      label: "Log Out",
      icon: LogOut,
      danger: true,
      action: () => {
        logout();
        router.push("/login");
      },
    },
  ];

  return (
    <motion.nav
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-1"
      aria-label="Settings navigation"
    >
      {menuItems.map((item) => {
        const Icon = item.icon;

        const content = (
          <motion.div
            variants={itemVariants}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-colors cursor-pointer",
              "hover:bg-muted",
              item.danger && "text-red-500"
            )}
          >
            <Icon size={20} className="shrink-0" aria-hidden="true" />
            <span className="flex-1 text-sm font-medium">{item.label}</span>
            {!item.danger && (
              <ChevronRight
                size={16}
                className="text-muted-foreground shrink-0"
                aria-hidden="true"
              />
            )}
          </motion.div>
        );

        if (item.action) {
          return (
            <button
              key={item.label}
              type="button"
              onClick={item.action}
              className="text-left"
            >
              {content}
            </button>
          );
        }

        if (item.href) {
          return (
            <Link key={item.label} href={item.href}>
              {content}
            </Link>
          );
        }

        return (
          <div key={item.label} role="button" tabIndex={0}>
            {content}
          </div>
        );
      })}
    </motion.nav>
  );
}
