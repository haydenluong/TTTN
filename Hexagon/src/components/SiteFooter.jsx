import { Render } from "@puckeditor/core";
import { puckConfig } from "../puck.config";

// Footer xuất hiện trên mọi trang — cùng lý do dùng 1 storage key chung như SiteHeader.jsx
export const footerStorageKey = "puck-data-footer";

const footerInitialData = {
  content: [{ type: "Footer", props: { ...puckConfig.components.Footer.defaultProps, id: "Footer-1" } }],
  root: {},
};

export function loadFooterData() {
  const saved = localStorage.getItem(footerStorageKey);
  return saved ? JSON.parse(saved) : footerInitialData;
}

export default function SiteFooter() {
  return <Render config={puckConfig} data={loadFooterData()} />;
}
