import { useEffect, useRef, useState } from "react";

function useCountUp(value, durationMs = 1200) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const rafRef = useRef(undefined);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const animate = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      const start = performance.now();
      const tick = (now) => {
        const progress = Math.min((now - start) / durationMs, 1);
        setCount(Math.round(progress * value));
        if (progress < 1) rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          animate();
        } else {
          if (rafRef.current) cancelAnimationFrame(rafRef.current);
          setCount(0);
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [value, durationMs]);

  return { count, ref };
}

export function StatNumber({ value, suffix = "+", className }) {
  const { count, ref } = useCountUp(value);
  return (
    <span ref={ref} className={className}>
      {count}
      {suffix}
    </span>
  );
}
