import type { CSSProperties } from "react";
import { alignmentField, type Alignment } from "./alignment";

export type TitleDivider = {
  width: number;
  color: string;
  align: Alignment;
};

export const titleDividerField = {
  type: "object" as const,
  label: "Vạch dưới tiêu đề",
  objectFields: {
    width: { type: "number" as const, label: "Độ dài (px)" },
    color: { type: "text" as const, label: "Màu" },
    align: alignmentField,
  },
};

// margin auto theo align — tách rời khỏi titleAlign, để vạch tự đứng lệch trái/giữa/phải
// dù tiêu đề căn khác hướng, không cần bọc trong flex container như tiêu đề.
export function dividerMarginStyle(align: Alignment): CSSProperties {
  if (align === "left") return { marginLeft: 0, marginRight: "auto" };
  if (align === "right") return { marginLeft: "auto", marginRight: 0 };
  return { marginLeft: "auto", marginRight: "auto" };
}
