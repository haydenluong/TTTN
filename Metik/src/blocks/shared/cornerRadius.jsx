import { fieldSelectStyle, LabeledNumberInput } from "./fieldStyles";

export function cornerRadiusToCss(r) {
  if (r.mode === "round") return "9999px";
  if (r.mode === "all") return `${r.all}px`;
  return `${r.topLeft}px ${r.topRight}px ${r.bottomRight}px ${r.bottomLeft}px`;
}

export const cornerRadiusField = {
  type: "custom",
  label: "Bo góc",
  render: ({ value: raw, onChange }) => {
    const value = raw || { mode: "all", all: 16, topLeft: 16, topRight: 16, bottomRight: 16, bottomLeft: 16 };
    const setMode = (mode) => onChange({ ...value, mode });
    const setAll = (all) => onChange({ ...value, all });
    const setCorner = (key, n) => onChange({ ...value, [key]: n });

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <select
          value={value.mode}
          onChange={(e) => setMode(e.target.value)}
          style={fieldSelectStyle}
        >
          <option value="each">Bo từng góc</option>
          <option value="all">Bo 4 góc</option>
          <option value="round">Bo tròn</option>
        </select>

        {value.mode === "all" && (
          <LabeledNumberInput label="Bo góc (px)" value={value.all} onChange={setAll} />
        )}

        {value.mode === "each" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <LabeledNumberInput label="Trên-trái (px)" value={value.topLeft} onChange={(n) => setCorner("topLeft", n)} />
            <LabeledNumberInput label="Trên-phải (px)" value={value.topRight} onChange={(n) => setCorner("topRight", n)} />
            <LabeledNumberInput label="Dưới-trái (px)" value={value.bottomLeft} onChange={(n) => setCorner("bottomLeft", n)} />
            <LabeledNumberInput label="Dưới-phải (px)" value={value.bottomRight} onChange={(n) => setCorner("bottomRight", n)} />
          </div>
        )}
      </div>
    );
  },
};
