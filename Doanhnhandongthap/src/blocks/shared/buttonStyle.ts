import type { CSSProperties } from "react";
import { type CornerRadius, cornerRadiusField, cornerRadiusToCss } from "./cornerRadius";

export type ButtonStyle = {
  label: string;
  bgColor: string;
  textColor: string;
  borderRadius: CornerRadius;
  fontSize: number;
};

export const buttonStyleField = {
  type: "object" as const,
  label: "Nút",
  objectFields: {
    label: { type: "text" as const, label: "Chữ trong nút" },
    bgColor: { type: "text" as const, label: "Màu nút" },
    textColor: { type: "text" as const, label: "Màu chữ nút" },
    borderRadius: cornerRadiusField,
    fontSize: { type: "number" as const, label: "Cỡ chữ nút (px)" },
  },
};

export function getButtonStyle(button: Pick<ButtonStyle, "bgColor" | "textColor" | "borderRadius" | "fontSize">): CSSProperties {
  return {
    backgroundColor: button.bgColor,
    color: button.textColor,
    borderRadius: cornerRadiusToCss(button.borderRadius),
    fontSize: `${button.fontSize}px`,
  };
}
