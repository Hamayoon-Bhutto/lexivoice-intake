"use client";

import { Bell, Menu, Search } from "lucide-react";
import { PropsWithChildren } from "react";

interface TopbarProps extends PropsWithChildren {
  title: string;
  onOpenMenu: () => void;
}

export function Topbar({ title, onOpenMenu, children }: TopbarProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur lg:px-8">
      <div className="flex items-center gap-3">
        <button
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
          onClick={onOpenMenu}
          aria-label="Ouvrir le menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="min-w-0 flex-1">
          <p className="text-sm text-slate-500">{title}</p>
          <div className="mt-2 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              placeholder="Rechercher un prospect, dossier, appel..."
              className="w-full border-0 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />
            <span className="hidden rounded-md bg-white px-2 py-0.5 text-xs text-slate-400 ring-1 ring-slate-200 md:block">
              Ctrl + K
            </span>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-3">
          {children}
          <button className="relative rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 hover:bg-slate-50">
            <Bell className="h-4 w-4" />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-indigo-600" />
          </button>
          <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 md:flex">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700">
              SM
            </div>
            <div className="leading-tight">
              <p className="text-sm font-semibold text-slate-800">Sophie Martin</p>
              <p className="text-xs text-slate-500">Cabinet Martin Avocats</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
