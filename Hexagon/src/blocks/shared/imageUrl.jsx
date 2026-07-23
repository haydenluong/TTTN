import { useRef } from "react";
import { fieldInputStyle, fieldMiniLabelStyle } from "./fieldStyles";

export function VideoUrlInput({ label = "URL video", value, onChange }) {
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result);
    reader.readAsDataURL(file);
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
          placeholder="https://... (hoặc tải video lên ở dưới)"
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
        Tải video lên từ máy
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      {value && (
        <video
          src={value}
          controls
          style={{
            maxWidth: "100%",
            maxHeight: 120,
            border: "1px solid var(--puck-color-grey-09)",
            borderRadius: 4,
          }}
        />
      )}
    </div>
  );
}

export function videoUrlField(label = "URL video") {
  return {
    type: "custom",
    label,
    render: ({ value, onChange }) => <VideoUrlInput label={label} value={value} onChange={onChange} />,
  };
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

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

export function imageUrlField(label = "URL ảnh") {
  return {
    type: "custom",
    label,
    render: ({ value, onChange }) => <ImageUrlInput label={label} value={value} onChange={onChange} />,
  };
}
