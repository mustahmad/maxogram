"use client";

import AuthGuard from "@/components/auth/AuthGuard";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import BottomNav from "@/components/layout/BottomNav";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="flex min-h-[100dvh]">
        <div className="hidden lg:block">
          <Sidebar />
        </div>
        <div className="flex flex-1 flex-col lg:ml-60">
          <div className="lg:hidden">
            <TopBar />
          </div>
          <main className="flex-1 pb-20 lg:pb-0">{children}</main>
          <div className="lg:hidden">
            <BottomNav />
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
