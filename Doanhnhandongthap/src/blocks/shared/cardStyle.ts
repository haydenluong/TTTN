import type { CSSProperties } from "react";
import { type CornerRadius, cornerRadiusField, cornerRadiusToCss } from "./cornerRadius";

export type CardStyle = {
  borderRadius: CornerRadius;
  textColor: string;
  fontSize: number;
};

export const cardStyleField = {
  type: "object" as const,
  label: "Kiểu thẻ",
  objectFields: {
    borderRadius: cornerRadiusField,
    textColor: { type: "text" as const, label: "Màu chữ" },
    fontSize: { type: "number" as const, label: "Cỡ chữ (px)" },
  },
};

export function getCardStyle(card: CardStyle): CSSProperties {
  return {
    borderRadius: cornerRadiusToCss(card.borderRadius),
    color: card.textColor,
    fontSize: `${card.fontSize}px`,
  };
}
