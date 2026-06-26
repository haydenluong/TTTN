import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Puck, Render, type Data } from "@puckeditor/core";
import "@puckeditor/core/puck.css";

import { puckConfig } from "./puck.config";
import { useState } from "react";
import { PuckNumberFieldOverride } from "./blocks/shared/fieldStyles";

// Thay field type:"number" gốc của Puck bằng bản tự chế — sửa lỗi backspace số nhảy về "0"
// (Number("") === 0 khiến input commit ngay giá trị 0 mỗi khi xoá hết chữ số).
const puckOverrides = { fieldTypes: { number: PuckNumberFieldOverride } };

type PageKey = "home" | "gioi-thieu" | "hoi-vien";

// Mỗi page có key localStorage riêng — sửa trang này không ảnh hưởng trang khác.
const storageKeys: Record<PageKey, string> = {
  home: "puck-data",
  "gioi-thieu": "puck-data-gioi-thieu",
  "hoi-vien": "puck-data-hoi-vien",
};

const homeInitialData: Data = {
  content: [
    {
      type: "Hero",
      props: {
        ...puckConfig.components.Hero.defaultProps,
        id: "Hero-1",
      },
    },
    {
      type: "SponsorBar",
      props: {
        ...puckConfig.components.SponsorBar.defaultProps,
        id: "SponsorBar-1",
      },
    },
    {
      type: "AboutSection",
      props: {
        ...puckConfig.components.AboutSection.defaultProps,
        id: "AboutSection-1",
      },
    },
    {
      type: "TeamsSection",
      props: {
        ...puckConfig.components.TeamsSection.defaultProps,
        id: "TeamsSection-1",
      },
    },
    {
      type: "StatsSection",
      props: {
        ...puckConfig.components.StatsSection.defaultProps,
        id: "StatsSection-1",
      },
    },
    {
      type: "NewsSection",
      props: {
        ...puckConfig.components.NewsSection.defaultProps,
        id: "NewsSection-1",
      },
    },
    {
      type: "ValuesSection",
      props: {
        ...puckConfig.components.ValuesSection.defaultProps,
        id: "ValuesSection-1",
      },
    },
    {
      type: "ContactCta",
      props: {
        ...puckConfig.components.ContactCta.defaultProps,
        id: "ContactCta-1",
      },
    },
  ],
  root: {},
};

const gioiThieuInitialData: Data = {
  content: [
    {
      type: "IntroSection",
      props: {
        ...puckConfig.components.IntroSection.defaultProps,
        id: "IntroSection-1",
      },
    },
  ],
  root: {},
};

const hoiVienInitialData: Data = {
  content: [
    {
      type: "MemberSection",
      props: {
        ...puckConfig.components.MemberSection.defaultProps,
        id: "MemberSection-1",
      },
    },
  ],
  root: {},
};

const initialDataByPage: Record<PageKey, Data> = {
  home: homeInitialData,
  "gioi-thieu": gioiThieuInitialData,
  "hoi-vien": hoiVienInitialData,
};

function loadData(page: PageKey): Data {
  const saved = localStorage.getItem(storageKeys[page]);
  const data: Data = saved ? JSON.parse(saved) : initialDataByPage[page];

  // root.props có thể thiếu field mới (vd: header/footer) — cả với data mặc định
  // (root: {} chưa từng có props) và data cũ lưu trước khi field đó tồn tại.
  // Merge với defaultProps mới nhất để root.render không bao giờ nhận props undefined.
  return {
    ...data,
    root: { ...data.root, props: { ...puckConfig.root?.defaultProps, ...data.root?.props } },
  };
}

const pageTabs: { key: PageKey; label: string }[] = [
  { key: "home", label: "Trang chủ" },
  { key: "gioi-thieu", label: "Giới thiệu" },
  { key: "hoi-vien", label: "Hội viên" },
];

// function để edit được cả 3 page trong cùng một trang edit
function SubPageEditor() {
  const [activePage, setActivePage] = useState<PageKey>("home");
  return (
    <>
      <div className="flex gap-2 border-b border-gray-200 bg-white px-4 py-2">
        {pageTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActivePage(tab.key)}
            className={
              activePage === tab.key
                ? "cursor-pointer rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
                : "cursor-pointer rounded-md px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100"
            }
          >
            {tab.label}
          </button>
        ))}
      </div>

{/* khi publish thi luu vao active page */}
      <Puck
        key={activePage}
        config={puckConfig}
        data={loadData(activePage)}
        overrides={puckOverrides}
        onPublish={(d) => {
          localStorage.setItem(storageKeys[activePage], JSON.stringify(d));
        }}
      />
    </>
  )
}

function PuckPage({ page }: { page: PageKey }) {
  const data = loadData(page);
  return <Render config={puckConfig} data={data} />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PuckPage page="home" />} />
        <Route path="/editor" element={<SubPageEditor />} />
        <Route path="/gioi-thieu" element={<PuckPage page="gioi-thieu" />} />
        <Route path="/hoi-vien" element={<PuckPage page="hoi-vien" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;