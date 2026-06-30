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

// margin auto theo align — tách rời khỏi titleAlign, để vạch tự đứng lệch trái/giữa/phải
// dù tiêu đề căn khác hướng, không cần bọc trong flex container như tiêu đề.
export function dividerMarginStyle(align) {
  if (align === "left") return { marginLeft: 0, marginRight: "auto" };
  if (align === "right") return { marginLeft: "auto", marginRight: 0 };
  return { marginLeft: "auto", marginRight: "auto" };
}
