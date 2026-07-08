"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  FileText,
  LayoutDashboard,
  Phone,
  Settings,
  Users,
  CalendarDays,
  X,
  AudioLines,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const navItems = [
  { label: "Tableau de bord", href: "/dashboard", icon: LayoutDashboard },
  { label: "Prospects", href: "/leads", icon: Users },
  { label: "Appels", href: "/calls", icon: Phone },
  { label: "Documents", href: "/documents", icon: FileText },
  { label: "Consultations", href: "/consultations", icon: CalendarDays },
  { label: "Rapports", href: "/dashboard", icon: BarChart3 },
  { label: "Parametres", href: "/settings", icon: Settings },
];

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-72 border-r border-slate-200 bg-white p-4 shadow-lg transition-transform lg:translate-x-0 lg:shadow-none",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between pb-5">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="rounded-xl bg-indigo-100 p-2 text-indigo-600">
              <AudioLines className="h-5 w-5" />
            </div>
            <div>
              <p className="text-lg font-bold text-slate-900">LexiVoice Intake</p>
              <p className="text-xs text-slate-500">AI Legal Intake</p>
            </div>
          </Link>
          <button
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
            onClick={onClose}
            aria-label="Fermer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                  isActive
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-600 hover:bg-slate-100",
                )}
                onClick={onClose}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-8 rounded-2xl border border-indigo-100 bg-indigo-50 p-4">
          <p className="text-sm font-semibold text-indigo-900">Besoin d aide ?</p>
          <p className="mt-1 text-xs text-indigo-700">
            Notre equipe est la pour vous accompagner.
          </p>
          <button className="mt-3 w-full rounded-lg bg-white px-3 py-2 text-xs font-semibold text-indigo-700 ring-1 ring-indigo-100 hover:bg-indigo-100">
            Contacter le support
          </button>
        </div>
      </aside>

      {open ? (
        <button
          onClick={onClose}
          className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden"
          aria-label="Fermer le menu"
        />
      ) : null}
    </>
  );
}
