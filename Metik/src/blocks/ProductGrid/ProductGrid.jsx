import { useEffect, useRef } from "react";
import { getBackgroundStyle } from "../shared/background";
import { cornerRadiusToCss } from "../shared/cornerRadius";

export default function ProductGrid({ products = [], background, imageRadius }) {
  const gridRef = useRef(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const cards = Array.from(grid.children);
    cards.forEach((card) => {
      card.style.opacity = "0";
      card.style.transform = "translateY(24px)";
      card.style.filter = "blur(4px)";
    });
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          cards.forEach((card, i) => {
            setTimeout(() => {
              card.style.transition = "opacity 0.5s ease, transform 0.5s ease, filter 0.5s ease";
              card.style.opacity = "1";
              card.style.transform = "translateY(0)";
              card.style.filter = "blur(0)";
            }, i * 100);
          });
          observer.unobserve(grid);
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(grid);
    return () => observer.disconnect();
  }, [products]);

  const bgStyle = background?.type ? getBackgroundStyle(background) : { backgroundColor: "#ffffff" };
  return (
    <section className="px-6 py-10" style={bgStyle}>
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm mb-8 text-gray-500">
          <a href="/" className="hover:text-gray-700 transition-colors">TRANG CHỦ</a>
          <span>/</span>
          <span className="font-bold text-gray-900">SẢN PHẨM</span>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-4 gap-6" ref={gridRef}>
          {products.map((product, i) => (
            <a key={i} href={product.href || "#"} className="group block overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300" style={{ borderRadius: imageRadius ? cornerRadiusToCss(imageRadius) : "0.75rem" }}>
              {/* Image */}
              <div className="relative overflow-hidden">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full aspect-square bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                    Ảnh sản phẩm
                  </div>
                )}
              </div>
              {/* Name bar inside the card */}
              <div className="bg-white py-3 px-3 text-center">
                <p className="font-semibold text-sm" style={{ color: "#f5a100" }}>
                  {product.name}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
