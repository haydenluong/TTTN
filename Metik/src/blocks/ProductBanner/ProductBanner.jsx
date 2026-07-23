import { useScrollReveal } from "../shared/useScrollReveal";

export default function ProductBanner({ bannerImageUrl }) {
  const ref = useScrollReveal();

  return (
    <div className="reveal w-full overflow-hidden" ref={ref}>
      {bannerImageUrl ? (
        <img
          src={bannerImageUrl}
          alt="Sản phẩm banner"
          className="w-full object-cover rounded-b-2xl"
          style={{ maxHeight: 340 }}
        />
      ) : (
        <div
          className="w-full flex items-center justify-center text-gray-400 text-sm rounded-b-2xl"
          style={{ height: 340, backgroundColor: "#e0f0ff" }}
        >
          Ảnh banner
        </div>
      )}
    </div>
  );
}
