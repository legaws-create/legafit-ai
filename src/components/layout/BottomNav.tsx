"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  IconHome,
  IconSpark,
  IconMeal,
  IconDumbbell,
  IconTrend,
} from "@/components/ui/icons";

const TABS = [
  { href: "/", label: "Beranda", Icon: IconHome },
  { href: "/nutrition", label: "Coach", Icon: IconSpark },
  { href: "/meals", label: "Menu", Icon: IconMeal },
  { href: "/gym", label: "Gym", Icon: IconDumbbell },
  { href: "/progress", label: "Progres", Icon: IconTrend },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-md px-3 pb-[env(safe-area-inset-bottom)]"
      aria-label="Navigasi utama"
    >
      <div className="mb-3 flex items-center justify-between rounded-3xl border border-white/[0.07] bg-ink-800/90 px-2 py-2 shadow-card backdrop-blur-lg">
        {TABS.map(({ href, label, Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className="group relative flex flex-1 flex-col items-center gap-1 py-1.5"
              aria-current={active ? "page" : undefined}
            >
              <span
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-2xl transition",
                  active ? "bg-lime text-ink" : "text-chalk-muted group-hover:text-chalk"
                )}
              >
                <Icon className="h-[22px] w-[22px]" />
              </span>
              <span
                className={cn(
                  "text-[0.62rem] font-medium tracking-wide transition",
                  active ? "text-chalk" : "text-chalk-faint"
                )}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
