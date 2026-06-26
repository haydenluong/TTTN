export type Alignment = "left" | "center" | "right";

export const alignmentField = {
  type: "select" as const,
  label: "Căn chỉnh",
  options: [
    { label: "Trái", value: "left" },
    { label: "Giữa", value: "center" },
    { label: "Phải", value: "right" },
  ],
};

const textAlignClass: Record<Alignment, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

const justifyClass: Record<Alignment, string> = {
  left: "justify-start",
  center: "justify-center",
  right: "justify-end",
};

// items-{start,center,end} — dùng cho wrapper flex-col khi cần các con (vd hr/div chiều
// rộng cố định) bám theo lề trái/giữa/phải, vì text-align không tác dụng lên block có width cố định.
const itemsClass: Record<Alignment, string> = {
  left: "items-start",
  center: "items-center",
  right: "items-end",
};

export function alignClass(align: Alignment, kind: "text" | "justify" | "items" = "text"): string {
  if (kind === "items") return itemsClass[align];
  return kind === "text" ? textAlignClass[align] : justifyClass[align];
}
