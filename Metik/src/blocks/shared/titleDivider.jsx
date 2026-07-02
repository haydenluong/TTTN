import { alignmentField } from "./alignment";

export const titleDividerField = {
  type: "object",
  label: "Vạch dưới tiêu đề",
  objectFields: {
    width: { type: "number", label: "Độ dài (px)" },
    color: { type: "text", label: "Màu" },
    align: alignmentField,
  },
};

export function dividerMarginStyle(align) {
  if (align === "left") return { marginLeft: 0, marginRight: "auto" };
  if (align === "right") return { marginLeft: "auto", marginRight: 0 };
  return { marginLeft: "auto", marginRight: "auto" };
}
