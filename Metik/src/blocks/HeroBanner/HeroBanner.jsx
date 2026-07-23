import { useState, useEffect, useCallback } from "react";

export default function HeroBanner({ slides = [] }) {
  const [current, setCurrent] = useState(0);
  const count = slides.length;

  const next = useCallback(() => setCurrent((c) => (c + 1) % Math.max(count, 1)), [count]);
  const prev = () => setCurrent((c) => (c - 1 + Math.max(count, 1)) % Math.max(count, 1));

  return (
    <div className="w-full">
      {/* Slide */}
      <div className="relative w-full overflow-hidden" style={{ height: 460 }}>
        <div
          className="flex h-full transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {slides.map((s, i) => (
            <div key={i} className="shrink-0 w-full h-full">
              {s.imageUrl ? (
                <img
                  src={s.imageUrl}
                  alt=""
                  style={{ display: "block", width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-lg">
                  Thêm ảnh slide
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Arrows */}
        {count > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/30 hover:bg-white/50 flex items-center justify-center transition"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={next}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/30 hover:bg-white/50 flex items-center justify-center transition"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Dots */}
        {count > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className="w-2.5 h-2.5 rounded-full transition"
                style={{ backgroundColor: i === current ? "white" : "rgba(255,255,255,0.45)" }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
