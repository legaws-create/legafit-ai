import { cn } from "@/lib/utils";

interface StatRingProps {
  value: number;
  max: number;
  label: string;
  sublabel?: string;
  size?: number;
  color?: string;
}

/** Circular progress ring rendered as inline SVG. */
export function StatRing({
  value,
  max,
  label,
  sublabel,
  size = 132,
  color = "#C7F551",
}: StatRingProps) {
  const stroke = 10;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(1, max > 0 ? value / max : 0));
  const offset = circ * (1 - pct);

  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.8s cubic-bezier(0.22,1,0.36,1)" }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <div className={cn("num text-2xl font-bold leading-none text-chalk")}>
            {Math.round(value).toLocaleString("id-ID")}
          </div>
          <div className="label mt-1">{label}</div>
          {sublabel && <div className="mt-0.5 text-[0.65rem] text-chalk-faint">{sublabel}</div>}
        </div>
      </div>
    </div>
  );
}
