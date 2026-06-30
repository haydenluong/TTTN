export const spacingField = {
  type: "object",
  label: "Khoảng đệm trên/dưới (padding) của cả section",
  objectFields: {
    paddingY: {
      type: "number",
      label: "Độ dày padding (x4px)",
      min: 0,
      max: 40,
      step: 1,
    },
  },
};

export function paddingYStyle(spacing) {
  const px = `${spacing.paddingY * 4}px`;
  return { paddingTop: px, paddingBottom: px };
}
