import { useRef } from "react";
import { fieldInputStyle, fieldMiniLabelStyle } from "./fieldStyles";

// Đọc file ảnh người dùng chọn thành data URL (base64) — không có backend nên
// không có nơi để "upload" thật, data URL nhúng luôn ảnh vào trong giá trị field.
function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function ImageUrlInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

export const imageUrlField = {
  type: "custom" as const,
  label: "Ảnh",
  render: ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
    <ImageUrlInput label="URL ảnh" value={value} onChange={onChange} />
  ),
};
