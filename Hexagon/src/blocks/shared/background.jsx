import { fieldMiniLabelStyle, fieldSelectStyle, LabeledSliderInput, LabeledTextInput } from "./fieldStyles";
import { ImageUrlInput } from "./imageUrl";

export const BACKGROUND_TYPES = [
  { value: "color", label: "Màu sắc" },
  { value: "gradient", label: "Gradient" },
  { value: "image", label: "Hình ảnh" },
  { value: "image+gradient", label: "Hình ảnh & Gradient" },
  { value: "image+color", label: "Hình ảnh & Màu sắc" },
];

export const GRADIENT_DIRECTIONS = [
  { value: "to right", label: "Trái → Phải" },
  { value: "to left", label: "Phải → Trái" },
  { value: "to bottom", label: "Trên → Dưới" },
  { value: "to bottom right", label: "Góc trên-trái → dưới-phải" },
  { value: "to bottom left", label: "Góc trên-phải → dưới-trái" },
];

// overlayOpacity chỉ áp dụng cho lớp phủ (gradient/màu), không làm mờ ảnh nền bên dưới —
// nên cần đổi màu hex sang rgba thay vì set opacity chung cho cả style
function hexToRgba(color, opacity = 1) {
  if (!color) return undefined;
  if (color.startsWith("rgb") || color.startsWith("hsl")) return color;
  const hex = color.replace("#", "");
  const full = hex.length === 3 ? hex.split("").map((c) => c + c).join("") : hex;
  const value = parseInt(full, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

export function getBackgroundStyle(bg) {
  if (!bg) return {};

  if (bg.type === "color") {
    return { backgroundColor: bg.color };
  }

  if (bg.type === "gradient") {
    return { backgroundImage: `linear-gradient(${bg.gradientDirection}, ${bg.gradientFrom}, ${bg.gradientTo})` };
  }

  const imageLayerStyle = {
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  };

  if (bg.type === "image") {
    return { backgroundImage: `url('${bg.imageUrl}')`, ...imageLayerStyle };
  }

  if (bg.type === "image+gradient") {
    const opacity = bg.overlayOpacity ?? 1;
    const from = hexToRgba(bg.gradientFrom, opacity);
    const to = hexToRgba(bg.gradientTo, opacity);
    return {
      backgroundImage: `linear-gradient(${bg.gradientDirection}, ${from}, ${to}), url('${bg.imageUrl}')`,
      ...imageLayerStyle,
    };
  }

  if (bg.type === "image+color") {
    const overlay = hexToRgba(bg.overlayColor, bg.overlayOpacity ?? 1);
    return {
      backgroundImage: `linear-gradient(${overlay}, ${overlay}), url('${bg.imageUrl}')`,
      ...imageLayerStyle,
    };
  }

  return {};
}

export const backgroundField = {
  type: "custom",
  label: "Nền",
  render: ({ value, onChange }) => {
    const v = value || { type: "color", color: "#ffffff" };
    const set = (key, val) => onChange({ ...v, [key]: val });

    const hasColor = v.type === "color";
    const hasImage = v.type === "image" || v.type === "image+gradient" || v.type === "image+color";
    const hasGradient = v.type === "gradient" || v.type === "image+gradient";
    const hasOverlayColor = v.type === "image+color";
    const hasOverlayOpacity = v.type === "image+gradient" || v.type === "image+color";

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {/* 1. type */}
        <label style={{ display: "block" }}>
          <span style={fieldMiniLabelStyle}>Loại nền</span>
          <select value={v.type} onChange={(e) => set("type", e.target.value)} style={fieldSelectStyle}>
            {BACKGROUND_TYPES.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>

        {/* 2. color */}
        {hasColor && (
          <LabeledTextInput label="Màu nền" value={v.color ?? ""} onChange={(val) => set("color", val)} />
        )}

        {/* 3. imageUrl */}
        {hasImage && (
          <ImageUrlInput label="URL ảnh nền" value={v.imageUrl ?? ""} onChange={(val) => set("imageUrl", val)} />
        )}

        {/* 4-6. gradientFrom / gradientTo / gradientDirection */}
        {hasGradient && (
          <>
            <LabeledTextInput
              label="Gradient từ"
              value={v.gradientFrom ?? ""}
              onChange={(val) => set("gradientFrom", val)}
              placeholder="vd: #135237"
            />
            <LabeledTextInput
              label="Gradient đến"
              value={v.gradientTo ?? ""}
              onChange={(val) => set("gradientTo", val)}
              placeholder="vd: #41b67d"
            />
            <label style={{ display: "block" }}>
              <span style={fieldMiniLabelStyle}>Hướng gradient</span>
              <select
                value={v.gradientDirection ?? "to right"}
                onChange={(e) => set("gradientDirection", e.target.value)}
                style={fieldSelectStyle}
              >
                {GRADIENT_DIRECTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </label>
          </>
        )}

        {/* 7. overlayColor */}
        {hasOverlayColor && (
          <LabeledTextInput
            label="Màu phủ lên ảnh"
            value={v.overlayColor ?? ""}
            onChange={(val) => set("overlayColor", val)}
          />
        )}

        {/* 8. overlayOpacity */}
        {hasOverlayOpacity && (
          <LabeledSliderInput
            label="Độ mờ lớp phủ"
            value={v.overlayOpacity ?? 0.5}
            onChange={(val) => set("overlayOpacity", val)}
          />
        )}
      </div>
    );
  },
};
