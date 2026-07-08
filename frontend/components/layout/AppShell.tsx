"use client";

import { PropsWithChildren, useState } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

interface AppShellProps extends PropsWithChildren {
  title: string;
  actions?: React.ReactNode;
}

export function AppShell({ title, actions, children }: AppShellProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="lg:pl-72">
        <Topbar title={title} onOpenMenu={() => setMenuOpen(true)}>
          {actions}
        </Topbar>
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
