import { cornerRadiusField, cornerRadiusToCss } from "./cornerRadius";

export const buttonStyleField = {
  type: "object",
  label: "Nút",
  objectFields: {
    label: { type: "text", label: "Chữ trong nút" },
    // thêm so với bản gốc Doanhnhandongthap/Metik: nút Hexagon cần trỏ tới route
    // thật (vd: /gioi-thieu), không chỉ cuộn tới section trong cùng trang
    href: { type: "text", label: "Đường dẫn (URL hoặc #id)" },
    bgColor: { type: "text", label: "Màu nút" },
    textColor: { type: "text", label: "Màu chữ nút" },
    borderRadius: cornerRadiusField,
    fontSize: { type: "number", label: "Cỡ chữ nút (px)" },
  },
};

export function getButtonStyle(button) {
  return {
    // `background` (not backgroundColor) on purpose: accepts both a flat
    // color ("#0072ff") and a gradient ("linear-gradient(...)") through the
    // same bgColor field, without adding a separate gradient field.
    background: button.bgColor,
    color: button.textColor,
    borderRadius: cornerRadiusToCss(button.borderRadius),
    fontSize: `${button.fontSize}px`,
  };
}
