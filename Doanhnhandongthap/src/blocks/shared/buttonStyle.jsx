import { cornerRadiusField, cornerRadiusToCss } from "./cornerRadius";

export const buttonStyleField = {
  type: "object",
  label: "Nút",
  objectFields: {
    label: { type: "text", label: "Chữ trong nút" },
    bgColor: { type: "text", label: "Màu nút" },
    textColor: { type: "text", label: "Màu chữ nút" },
    borderRadius: cornerRadiusField,
    fontSize: { type: "number", label: "Cỡ chữ nút (px)" },
  },
};

export function getButtonStyle(button) {
  return {
    backgroundColor: button.bgColor,
    color: button.textColor,
    borderRadius: cornerRadiusToCss(button.borderRadius),
    fontSize: `${button.fontSize}px`,
  };
}
