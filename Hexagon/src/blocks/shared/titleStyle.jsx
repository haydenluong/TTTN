export const titleStyleField = {
  type: "object",
  label: "Kiểu tiêu đề",
  objectFields: {
    fontSize: { type: "number", label: "Cỡ chữ (px)" },
    textColor: { type: "text", label: "Màu chữ" },
  },
};

export function getTitleStyle(t) {
  return { fontSize: `${t.fontSize}px`, color: t.textColor };
}
