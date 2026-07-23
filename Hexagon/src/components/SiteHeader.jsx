import { Render } from "@puckeditor/core";
import { puckConfig } from "../puck.config";

// Header xuất hiện trên mọi trang, không riêng của trang chủ — nên chỉ 1 storage
// key dùng chung toàn site, khác với puck-data-home/puck-data-service-*/...
export const headerStorageKey = "puck-data-header";

const headerInitialData = {
  content: [{ type: "Header", props: { ...puckConfig.components.Header.defaultProps, id: "Header-1" } }],
  root: {},
};

export function loadHeaderData() {
  const saved = localStorage.getItem(headerStorageKey);
  return saved ? JSON.parse(saved) : headerInitialData;
}

export default function SiteHeader() {
  return <Render config={puckConfig} data={loadHeaderData()} />;
}
