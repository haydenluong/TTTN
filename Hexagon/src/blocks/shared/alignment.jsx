export const alignmentField = {
  type: "select",
  label: "Căn chỉnh",
  options: [
    { label: "Trái", value: "left" },
    { label: "Giữa", value: "center" },
    { label: "Phải", value: "right" },
  ],
};

const textAlignClass = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

const justifyClass = {
  left: "justify-start",
  center: "justify-center",
  right: "justify-end",
};

const itemsClass = {
  left: "items-start",
  center: "items-center",
  right: "items-end",
};

export function alignClass(align, kind = "text") {
  if (kind === "items") return itemsClass[align];
  return kind === "text" ? textAlignClass[align] : justifyClass[align];
}
