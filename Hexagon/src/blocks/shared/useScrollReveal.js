import { useEffect, useRef } from "react";

// enabled=false (Puck's "animate" toggle off) vẫn áp class "reveal-visible" —
// chỉ bỏ observer/delay — nên trạng thái cuối cùng luôn giống nhau, chỉ khác
// có chuyển động hay không (tránh phần tử bị kẹt ở opacity:0 vĩnh viễn)
export function useScrollReveal(delay = 0, enabled = true) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (!enabled) {
      el.classList.add("reveal-visible");
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => el.classList.add("reveal-visible"), delay);
          observer.unobserve(el);
        }
      },
      { threshold: 0.07 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, enabled]);
  return ref;
}
