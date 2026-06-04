"use client";

/**
 * Tiny dependency-free charts (SVG). Good enough for dashboard analytics
 * without pulling in a charting library that complicates SSR.
 */

export function BarChart({
  data,
  height = 140,
  color = "#C7F551",
}: {
  data: { label: string; value: number }[];
  height?: number;
  color?: string;
}) {
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <div className="flex items-end gap-2" style={{ height }}>
      {data.map((d, i) => {
        const h = (d.value / max) * (height - 24);
        return (
          <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
            <div className="num text-[0.6rem] text-chalk-faint">
              {d.value > 0 ? Math.round(d.value) : ""}
            </div>
            <div
              className="w-full rounded-lg"
              style={{
                height: Math.max(4, h),
                background: `linear-gradient(180deg, ${color}, ${color}55)`,
                transition: "height 0.6s cubic-bezier(0.22,1,0.36,1)",
              }}
            />
            <div className="text-[0.6rem] text-chalk-faint">{d.label}</div>
          </div>
        );
      })}
    </div>
  );
}

export function LineChart({
  data,
  height = 120,
  color = "#FF6B35",
}: {
  data: number[];
  height?: number;
  color?: string;
}) {
  const w = 320;
  if (data.length < 2) {
    return <div className="text-sm text-chalk-faint">Belum cukup data.</div>;
  }
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const stepX = w / (data.length - 1);
  const points = data.map((v, i) => {
    const x = i * stepX;
    const y = height - ((v - min) / span) * (height - 16) - 8;
    return [x, y] as const;
  });
  const path = points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const area = `${path} L${w},${height} L0,${height} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${height}`} className="w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="lc" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#lc)" />
      <path d={path} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {points.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3" fill={color} />
      ))}
    </svg>
  );
}
