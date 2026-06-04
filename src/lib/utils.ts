/** Tiny classnames joiner (no dependency needed). */
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

/** Indonesian rupiah-free number formatting helpers. */
export const fmt = {
  kcal: (n: number) => `${Math.round(n).toLocaleString("id-ID")} kkal`,
  kg: (n: number) => `${n.toLocaleString("id-ID", { maximumFractionDigits: 1 })} kg`,
  km: (m: number) => `${(m / 1000).toLocaleString("id-ID", { maximumFractionDigits: 1 })} km`,
  duration: (sec: number) => {
    const h = Math.floor(sec / 3600);
    const m = Math.round((sec % 3600) / 60);
    return h > 0 ? `${h}j ${m}m` : `${m}m`;
  },
};
