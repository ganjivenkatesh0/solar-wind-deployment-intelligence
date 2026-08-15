import { cn } from "@/lib/utils";

/** Solar + wind brand mark: sun rays, turbine and leaf, matching the platform logo. */
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={cn("size-9", className)} aria-hidden="true">
      <g stroke="var(--solar)" strokeWidth="2" strokeLinecap="round">
        <path d="M20 3v4M31 7.5l-2.6 2.6M36 19h-4M8 19H4M9 7.5l2.6 2.6" />
      </g>
      <circle cx="20" cy="19" r="4.5" fill="var(--solar)" opacity="0.9" />
      <path
        d="M20 36V19"
        stroke="var(--wind)"
        strokeWidth="2.2"
        strokeLinecap="round"
        opacity="0.85"
      />
      <path
        d="M20 19c4.5-3.5 9-2.5 11 1.5-4.5 2.5-8.5 1.5-11-1.5Z"
        fill="var(--primary)"
        opacity="0.85"
      />
      <path
        d="M20 19c-4.5-3.5-9-2.5-11 1.5 4.5 2.5 8.5 1.5 11-1.5Z"
        fill="var(--primary)"
        opacity="0.55"
      />
      <path d="M20 26c3 0 5.5 2.4 5.5 5.5-3 0-5.5-2.4-5.5-5.5Z" fill="var(--primary)" />
    </svg>
  );
}
