import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Puck, Render } from "@puckeditor/core";
import "@puckeditor/core/puck.css";

import { puckConfig } from "./puck.config";
import { useState } from "react";
import { PuckNumberFieldOverride } from "./blocks/shared/fieldStyles";

const puckOverrides = { fieldTypes: { number: PuckNumberFieldOverride } };

const storageKeys = {
  home: "puck-data",
  "gioi-thieu": "puck-data-gioi-thieu",
  "san-pham": "puck-data-san-pham",
  "lien-he": "puck-data-lien-he",
};

const initialDataByPage = {
  home: {
    content: [
      {
        type: "HeroBanner",
        props: {
          id: "hero-1",
          slides: [
            { imageUrl: "/images/anh-slide-1.png" },
            { imageUrl: "/images/anh-slide-2.png" },
          ],
        },
      },
      {
        type: "NewProducts",
        props: {
          id: "products-1",
          title: "SẢN PHẨM MỚI",
          products: [
            { imageUrl: "", name: "Sản phẩm 1", href: "#" },
            { imageUrl: "", name: "Sản phẩm 2", href: "#" },
            { imageUrl: "", name: "Sản phẩm 3", href: "#" },
            { imageUrl: "", name: "Sản phẩm 4", href: "#" },
          ],
        },
      },
      {
        type: "AboutSection",
        props: {
          id: "about-1",
          title: "GIỚI THIỆU VỀ METIK",
          introText:
            "metik là thương hiệu snack thuộc OCHAO, được phát triển trong hệ sinh thái HUNGHAU Holdings với định hướng mang đến những sản phẩm ăn vặt thơm ngon, vui tươi và phù hợp với nhịp sống hiện đại.",
          row1Text:
            "Ra đời từ nền tảng sản xuất bánh kẹo của OCHAO, METIK kế thừa hệ thống nhà máy hiện đại, quy trình sản xuất khép kín và tiêu chuẩn kiểm soát chất lượng nghiêm ngặt. METIK tập trung phát triển các dòng snack giòn, nhẹ, dễ ăn và phù hợp với nhiều nhóm khách hàng. Sản phẩm được nghiên cứu với nhiều hương vị hấp dẫn như rong biển, bắp, phô mai, BBQ và các hương vị đặc trưng khác.",
          row2Bullets: [
            { value: "Sử dụng nguyên liệu có nguồn gốc rõ ràng, phù hợp với tiêu chuẩn sản xuất thực phẩm." },
            { value: "Quy trình sản xuất hiện đại, khép kín và đảm bảo vệ sinh an toàn thực phẩm." },
            { value: "Kiểm soát chất lượng chặt chẽ trong từng công đoạn, từ nguyên liệu đầu vào đến thành phẩm." },
          ],
          row3Text:
            "Với hương vị hấp dẫn, phong cách trẻ trung và tinh thần vui nhộn, METIK hướng đến hình ảnh một thương hiệu snack năng động, gắn gũi và dễ tạo thiện cảm với người tiêu dùng Việt Nam.",
          bgColor: "#fdf5e8",
        },
      },
      {
        type: "AboutVideo",
        props: {
          id: "video-1",
          title: "VỀ CHÚNG TÔI",
          paragraph1:
            'Với tinh thần "Chạm mê tít – Snap into Joy", metik mong muốn trở thành người bạn đồng hành trong những khoảnh khắc vui vẻ hàng ngày. Từ những buổi gặp gỡ bạn bè, giờ giải lao, chuyến đi chơi đến những phút thư giãn tại nhà, metik mang đến trải nghiệm ăn vặt giòn ngon, trẻ trung và đầy cảm hứng.',
          paragraph2:
            "metik không chỉ là một sản phẩm snack. metik là cảm giác giòn vui khi mở gói, là hương vị dễ mê trong từng miếng bánh và là nguồn năng lượng tích cực cho những khoảnh khắc thường ngày.",
          videoUrl: "",
          bgColor: "#fef6e0",
        },
      },
      {
        type: "Testimonials",
        props: {
          id: "testimonials-1",
          title: "KHÁCH HÀNG NÓI GÌ?",
          titleStyle: { fontSize: 24, textColor: "#1a7a2e" },
          background: { type: "color", color: "#fdf5e8" },
          testimonials: [
            {
              avatarUrl: "",
              name: "Sinh viên Huỳnh Vĩnh",
              role: "TP.HCM",
              stars: 5,
              quote: 'Snack metik ăn vừa giòn, vừa ngon vừa cuốn miệng. Em thường lựa chọn để mang theo tới trường"',
              quoteSize: 15,
              quoteColor: "#4b5563",
            },
            {
              avatarUrl: "",
              name: "Bạn Mỹ Duyên",
              role: "Đồng Tháp",
              stars: 5,
              quote: '"metik gợi nhớ cho em rất nhiều kỉ niệm thời thơ ấu. Hy vọng nhãn hàng trong tương lai sẽ ra nhiều sản phẩm độc đáo hơn nữa."',
              quoteSize: 15,
              quoteColor: "#4b5563",
            },
          ],
        },
      },
    ],
    root: {},
  },
  "gioi-thieu": {
    content: [
      {
        type: "GioiThieuSection",
        props: {
          id: "gioi-thieu-1",
          paragraph1:
            'Với tinh thần "Chạm mê tít – Snap into Joy", metik mong muốn trở thành người bạn đồng hành trong những khoảnh khắc vui vẻ hàng ngày. Từ những buổi gặp gỡ bạn bè, giờ giải lao, chuyến đi chơi đến những phút thư giãn tại nhà, metik mang đến trải nghiệm ăn vặt giòn ngon, trẻ trung và đầy cảm hứng.',
          paragraph2:
            'metik không chỉ là một sản phẩm snack. metik là cảm giác giòn vui khi mở gói, là hương vị dễ mê trong từng miếng bánh và là nguồn năng lượng tích cực cho những khoảnh khắc thường ngày.',
          videoUrl: "",
        },
      },
    ],
    root: {},
  },
  "san-pham": {
    content: [
      {
        type: "ProductBanner",
        props: {
          id: "product-banner-1",
          bannerImageUrl: "",
        },
      },
      {
        type: "ProductGrid",
        props: {
          id: "product-grid-1",
          products: [
            { imageUrl: "", name: "Snack vị Bắp", href: "#" },
            { imageUrl: "", name: "Snack vị BBQ", href: "#" },
            { imageUrl: "", name: "Snack vị Phô mai", href: "#" },
            { imageUrl: "", name: "Snack vị Tảo biển", href: "#" },
          ],
        },
      },
    ],
    root: {},
  },
  "lien-he": {
    content: [
      {
        type: "ContactMap",
        props: {
          id: "contact-map-1",
          embedUrl: "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3917.5675823692486!2d106.53502300000001!3d10.920431!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x310b2d6619d65c51%3A0xaa40266b17ad7191!2zQ8O0bmcgdHkgQ-G7lSBQaOG6p24gT0NIQU8!5e0!3m2!1svi!2sus!4v1782982674475!5m2!1svi!2sus",
          height: 600,
        },
      },
    ],
    root: {},
  },
};

function loadData(page) {
  const saved = localStorage.getItem(storageKeys[page]);
  const data = saved ? JSON.parse(saved) : initialDataByPage[page];
  return {
    ...data,
    root: { ...data.root, props: { ...puckConfig.root?.defaultProps, ...data.root?.props } },
  };
}

const pageTabs = [
  { key: "home", label: "Trang chủ" },
  { key: "gioi-thieu", label: "Giới thiệu" },
  { key: "san-pham", label: "Sản phẩm" },
  { key: "lien-he", label: "Liên hệ" },
];

function SubPageEditor() {
  const [activePage, setActivePage] = useState("home");
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
  );
}

function PuckPage({ page }) {
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
        <Route path="/san-pham" element={<PuckPage page="san-pham" />} />
        <Route path="/lien-he" element={<PuckPage page="lien-he" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
