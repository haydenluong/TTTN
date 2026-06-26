import type { CSSProperties } from "react";

export type SectionSpacing = {
  paddingY: number;
};

export const spacingField = {
  type: "object" as const,
  label: "Khoảng đệm trên/dưới (padding)",
  objectFields: {
    paddingY: {
      type: "number" as const,
      label: "Độ dày padding (x4px)",
      min: 0,
      max: 40,
      step: 1,
    },
  },
};

export function paddingYStyle(spacing: SectionSpacing): CSSProperties {
  const px = `${spacing.paddingY * 4}px`;
  return { paddingTop: px, paddingBottom: px };
}
