import { fieldMiniLabelStyle, fieldSelectStyle, LabeledTextInput } from "./fieldStyles";
import { ImageUrlInput } from "./imageUrl";

function gradientLayer(from, via, via2, to, direction = "to bottom") {
  const stops = [from, via, via2, to].filter(Boolean).join(", ");
  return stops ? `linear-gradient(${direction}, ${stops})` : "";
}

export function getBackgroundStyle(bg) {
  const style = {};

  if (bg.type === "color") style.backgroundColor = bg.color;

  const layers = [];
  let blendMode;

  if (bg.type === "gradient-image" || bg.type === "gradient-color") {
    if (bg.type === "gradient-image" && bg.overlayUrl) {
      layers.push(`url('${bg.overlayUrl}')`);
      blendMode = "screen";
    }
    if (bg.type === "gradient-color" && bg.color) {
      layers.push(`linear-gradient(${bg.color}, ${bg.color})`);
      blendMode = "multiply";
    }
    const g1 = gradientLayer(bg.gradientFrom, bg.gradientVia, bg.gradientVia2, bg.gradientTo, bg.gradientDirection);
    if (g1) layers.push(g1);
    const g2 = gradientLayer(bg.gradient2From, bg.gradient2Via, undefined, bg.gradient2To, bg.gradient2Direction);
    if (g2) layers.push(g2);
  }

  if (bg.type === "image" && bg.imageUrl) layers.push(`url('${bg.imageUrl}')`);
  if (bg.type === "gif" && bg.gifUrl) layers.push(`url('${bg.gifUrl}')`);
  if (bg.baseImageUrl) layers.push(`url('${bg.baseImageUrl}')`);

  if (layers.length) {
    style.backgroundImage = layers.join(", ");
    style.backgroundSize = "cover";
    style.backgroundPosition = bg.baseImagePosition || "center";
    style.backgroundRepeat = "no-repeat";
    if (blendMode) style.backgroundBlendMode = blendMode;
  }

  return style;
}

const typeOptions = [
  { label: "Màu", value: "color" },
  { label: "Ảnh phủ lên Gradient", value: "gradient-image" },
  { label: "Màu phủ lên Gradient", value: "gradient-color" },
  { label: "Hình ảnh", value: "image" },
  { label: "GIF", value: "gif" },
];

export const backgroundField = {
  type: "custom",
  label: "Nền",
  render: ({ value, onChange }) => {
    const v = value || { type: "color", color: "" };
    const set = (key, val) => onChange({ ...v, [key]: val });

    const isGradient = v.type === "gradient-image" || v.type === "gradient-color";

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <label style={{ display: "block" }}>
          <span style={fieldMiniLabelStyle}>Chọn loại nền</span>
          <select
            value={v.type}
            onChange={(e) => set("type", e.target.value)}
            style={fieldSelectStyle}
          >
            {typeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>

        {(v.type === "color" || v.type === "gradient-color") && (
          <LabeledTextInput label="Màu nền" value={v.color ?? ""} onChange={(v) => set("color", v)} />
        )}

        {isGradient && (
          <>
            <LabeledTextInput
              label="Gradient từ"
              value={v.gradientFrom ?? ""}
              onChange={(v) => set("gradientFrom", v)}
              placeholder="vd: #fff hoặc rgba(...) 0%"
            />
            <LabeledTextInput
              label="Gradient đến"
              value={v.gradientTo ?? ""}
              onChange={(v) => set("gradientTo", v)}
            />
            <LabeledTextInput
              label="Hướng gradient"
              value={v.gradientDirection ?? ""}
              onChange={(v) => set("gradientDirection", v)}
              placeholder="vd: to bottom, 180deg"
            />
          </>
        )}

        {v.type === "gradient-image" && (
          <ImageUrlInput
            label="URL ảnh phủ lên gradient"
            value={v.overlayUrl ?? ""}
            onChange={(v) => set("overlayUrl", v)}
          />
        )}

        {v.type === "image" && (
          <ImageUrlInput label="URL ảnh nền" value={v.imageUrl ?? ""} onChange={(v) => set("imageUrl", v)} />
        )}

        {v.type === "gif" && (
          <ImageUrlInput label="URL GIF nền" value={v.gifUrl ?? ""} onChange={(v) => set("gifUrl", v)} />
        )}

        {isGradient && (
          <>
            <ImageUrlInput
              label="Ảnh nền dưới cùng (tuỳ chọn)"
              value={v.baseImageUrl ?? ""}
              onChange={(v) => set("baseImageUrl", v)}
            />
            <LabeledTextInput
              label="Vị trí ảnh nền dưới cùng"
              value={v.baseImagePosition ?? ""}
              onChange={(v) => set("baseImagePosition", v)}
              placeholder="vd: right center"
            />
          </>
        )}

      </div>
    );
  },
};
