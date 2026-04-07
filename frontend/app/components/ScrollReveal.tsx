"use client";

import { useEffect, useRef, ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  /** Stagger delay in ms */
  delay?: number;
  /** Extra CSS classes only applied after reveal */
  revealClass?: string;
}

/**
 * Wraps children in a div that fades + slides up when it enters the viewport.
 * Uses IntersectionObserver — no external deps.
 */
export default function ScrollReveal({
  children,
  className = "",
  delay = 0,
  revealClass = "",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.transitionDelay = `${delay}ms`;
          el.classList.add("in-view");
          if (revealClass) el.classList.add(...revealClass.split(" "));
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, revealClass]);

  return (
    <div ref={ref} className={`reveal ${className}`}>
      {children}
    </div>
  );
}
