import { BottomNav } from "@/components/layout/BottomNav";

/**
 * Mobile-first shell. Content is capped at a phone width and centered, so the
 * layout looks intentional on desktop too rather than stretched.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto flex min-h-dvh w-full max-w-md flex-col">
      <main className="flex-1 px-4 pb-28 pt-5">{children}</main>
      <BottomNav />
    </div>
  );
}
