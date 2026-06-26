export type TitleDivider = {
  width: number;
  color: string;
};

export const titleDividerField = {
  type: "object" as const,
  label: "Vạch dưới tiêu đề",
  objectFields: {
    width: { type: "number" as const, label: "Độ dài (px)" },
    color: { type: "text" as const, label: "Màu" },
  },
};
