import { useRef } from "react";
import { fieldInputStyle, fieldMiniLabelStyle } from "./fieldStyles";

// Đọc file ảnh người dùng chọn thành data URL (base64) — không có backend nên
// không có nơi để "upload" thật, data URL nhúng luôn ảnh vào trong giá trị field.
function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// URL input + nút "tải lên từ máy" + xem trước ảnh — dùng được cả như nội dung của
// 1 Puck field (qua imageUrlField) và lồng trực tiếp bên trong field tự chế khác
// (background.tsx dùng lại y nguyên component này cho overlayUrl/imageUrl/gifUrl/baseImageUrl).
export function ImageUrlInput({ label = "URL ảnh", value, onChange }) {
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onChange(await readFileAsDataUrl(file));
    e.target.value = "";
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <label style={{ display: "block" }}>
        <span style={fieldMiniLabelStyle}>{label}</span>
        <input
          type="text"
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://... (hoặc tải ảnh lên ở dưới)"
          style={fieldInputStyle}
        />
      </label>

      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        style={{
          ...fieldInputStyle,
          cursor: "pointer",
          background: "var(--puck-color-grey-11)",
          fontWeight: 600,
        }}
      >
        Tải ảnh lên từ máy
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      {value && (
        <img
          src={value}
          alt=""
          style={{
            maxWidth: "100%",
            maxHeight: 140,
            objectFit: "contain",
            border: "1px solid var(--puck-color-grey-09)",
            borderRadius: 4,
          }}
        />
      )}
    </div>
  );
}

// Factory vì mỗi field cần label riêng trên sidebar (vd "URL ảnh logo", "URL icon"...).
export function imageUrlField(label = "URL ảnh") {
  return {
    type: "custom",
    label,
    render: ({ value, onChange }) => <ImageUrlInput value={value} onChange={onChange} />,
  };
}
