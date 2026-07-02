export default function ContactMap({ embedUrl, height }) {
  const mapHeight = height || 600;
  return (
    <section style={{ width: "100%", height: mapHeight }}>
      {embedUrl ? (
        <iframe
          src={embedUrl}
          width="100%"
          height="100%"
          style={{ border: 0, display: "block" }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Bản đồ liên hệ"
        />
      ) : (
        <div
          className="w-full flex items-center justify-center bg-gray-100 text-gray-400 text-sm"
          style={{ height: mapHeight }}
        >
          Chưa có bản đồ — nhập URL nhúng Google Maps vào trường bên dưới
        </div>
      )}
    </section>
  );
}
