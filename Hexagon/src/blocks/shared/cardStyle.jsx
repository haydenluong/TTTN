import { cornerRadiusField, cornerRadiusToCss } from "./cornerRadius";

export const cardStyleField = {
  type: "object",
  label: "Kiểu thẻ",
  objectFields: {
    borderRadius: cornerRadiusField,
    textColor: { type: "text", label: "Màu chữ" },
    fontSize: { type: "number", label: "Cỡ chữ (px)" },
  },
};

export function getCardStyle(card) {
  return {
    borderRadius: cornerRadiusToCss(card.borderRadius),
    color: card.textColor,
    fontSize: `${card.fontSize}px`,
  };
}
