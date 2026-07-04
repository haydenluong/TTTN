import { useScrollReveal } from "../shared/useScrollReveal";
import { getBackgroundStyle } from "../shared/background";
import { cornerRadiusToCss } from "../shared/cornerRadius";
import { TitleWithDivider } from "../shared/titleDivider";

export default function NewProducts({ title, titleStyle = {}, divider, products = [], background, imageRadius }) {
  const ref = useScrollReveal();
  const bgStyle = background?.type ? getBackgroundStyle(background) : {};
  return (
    <section className="reveal relative" ref={ref}>
      <div className="absolute inset-0" style={bgStyle} />
      <div className="relative z-10 px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <TitleWithDivider title={title} titleStyle={titleStyle} divider={divider} />

          {/* Grid */}
          <div className="grid grid-cols-4 gap-6">
            {products.map((product, i) => (
              <a key={i} href={product.href || "#"} className="group block overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300" style={{ borderRadius: imageRadius ? cornerRadiusToCss(imageRadius) : "0.75rem" }}>
                <div className="overflow-hidden">
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
                <div className="bg-white py-3 px-3 text-center">
                  <p className="font-semibold" style={{ fontSize: product.nameSize ? `${product.nameSize}px` : "0.875rem", color: product.nameColor || "#f5a100" }}>
                    {product.name}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
