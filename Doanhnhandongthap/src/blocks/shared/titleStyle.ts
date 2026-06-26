import type { CSSProperties } from "react";

export type TitleStyle = {
  fontSize: number;
  textColor: string;
};

export const titleStyleField = {
  type: "object" as const,
  label: "Kiểu tiêu đề",
  objectFields: {
    fontSize: { type: "number" as const, label: "Cỡ chữ (px)" },
    textColor: { type: "text" as const, label: "Màu chữ" },
  },
};

export function getTitleStyle(t: TitleStyle): CSSProperties {
  return { fontSize: `${t.fontSize}px`, color: t.textColor };
}
