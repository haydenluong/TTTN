import { alignmentField } from "./alignment";

export const titleDividerField = {
  type: "object",
  label: "Vạch dưới tiêu đề",
  objectFields: {
    color: { type: "text", label: "Màu highlight" },
    width: { type: "number", label: "Chiều rộng (px)" },
    align: alignmentField,
  },
};

const justifyMap = { left: "flex-start", center: "center", right: "flex-end" };

export function TitleWithDivider({ title, titleStyle = {}, divider, className = "mb-8" }) {
  const align = divider?.align || "left";
  const highlightColor = divider?.color || "#FFD000";
  const textColor = titleStyle.textColor || "#48A842";
  const fontSize = titleStyle.fontSize ? `${titleStyle.fontSize}px` : "1.5rem";

  return (
    <div className={className} style={{ display: "flex", justifyContent: justifyMap[align] || "flex-start" }}>
      <div style={{ position: "relative", display: "inline-block", paddingBottom: 3 }}>
        <div style={{
          position: "absolute",
          left: "11%",
          width: "122%",
          top: "54%",
          height: "calc(46% + 3px)",
          backgroundColor: highlightColor,
          zIndex: 0,
        }} />
        <span style={{
          position: "relative",
          zIndex: 1,
          display: "block",
          color: textColor,
          fontFamily: "'Nunito', 'Baloo 2', 'Fredoka', 'Quicksand', sans-serif",
          fontWeight: 800,
          letterSpacing: "0.04em",
          fontSize,
          textTransform: "uppercase",
          lineHeight: 1.1,
          whiteSpace: "nowrap",
        }}>
          {title}
        </span>
      </div>
    </div>
  );
}

export function dividerMarginStyle(align) {
  if (align === "left") return { marginLeft: 0, marginRight: "auto" };
  if (align === "right") return { marginLeft: "auto", marginRight: 0 };
  return { marginLeft: "auto", marginRight: "auto" };
}
