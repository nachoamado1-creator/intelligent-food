"use client";

import { useEffect, useState } from "react";

export function useCountdown(target: string | Date) {
  const targetMs = typeof target === "string" ? new Date(target).getTime() : target.getTime();
  const [now, setNow] = useState<number>(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const remaining = Math.max(0, targetMs - now);
  const hours = Math.floor(remaining / 3_600_000);
  const minutes = Math.floor((remaining % 3_600_000) / 60_000);
  const seconds = Math.floor((remaining % 60_000) / 1000);
  return { remaining, hours, minutes, seconds, expired: remaining <= 0 };
}

export function Countdown({ target, className }: { target: string | Date; className?: string }) {
  const { hours, minutes, seconds, expired } = useCountdown(target);
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <span className={className}>
      {expired ? "Expirado" : `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`}
    </span>
  );
}
