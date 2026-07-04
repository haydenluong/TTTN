import Header from "./blocks/Header/Header";
import Footer from "./blocks/Footer/Footer";
import HeroBanner from "./blocks/HeroBanner/HeroBanner";
import NewProducts from "./blocks/NewProducts/NewProducts";
import AboutSection from "./blocks/AboutSection/AboutSection";
import AboutVideo from "./blocks/AboutVideo/AboutVideo";
import Testimonials from "./blocks/Testimonials/Testimonials";
import GioiThieuSection from "./blocks/GioiThieuSection/GioiThieuSection";
import ProductBanner from "./blocks/ProductBanner/ProductBanner";
import ProductGrid from "./blocks/ProductGrid/ProductGrid";
import ContactMap from "./blocks/ContactMap/ContactMap";
import { cornerRadiusField, cornerRadiusToCss } from "./blocks/shared/cornerRadius";
import { imageUrlField, videoUrlField } from "./blocks/shared/imageUrl";
import { titleStyleField } from "./blocks/shared/titleStyle";
import { backgroundField } from "./blocks/shared/background";
import { titleDividerField } from "./blocks/shared/titleDivider";

const headerField = {
  type: "object",
  label: "Header",
  objectFields: {
    logoUrl: imageUrlField("URL logo"),
    facebookUrl: { type: "text", label: "Facebook URL" },
    tiktokUrl: { type: "text", label: "TikTok URL" },
    linkedinUrl: { type: "text", label: "LinkedIn URL" },
  },
};

const footerField = {
  type: "object",
  label: "Footer",
  objectFields: {
    logoUrl: imageUrlField("URL logo"),
    tagline: { type: "textarea", contentEditable: true, label: "Tagline" },
    phone: { type: "text", contentEditable: true, label: "Điện thoại" },
    email: { type: "text", contentEditable: true, label: "Email" },
    address: { type: "textarea", contentEditable: true, label: "Địa chỉ" },
    copyright: { type: "text", contentEditable: true, label: "Dòng bản quyền" },
  },
};

export const puckConfig = {
  components: {
    HeroBanner: {
      label: "Banner Trang Chủ",
      fields: {
        slides: {
          type: "array",
          label: "Slides",
          arrayFields: {
            imageUrl: imageUrlField("URL ảnh"),
          },
          getItemSummary: (_, i) => `Slide ${i + 1}`,
        },
      },
      defaultProps: {
        slides: [
          { imageUrl: "/images/anh-slide-1.png" },
          { imageUrl: "/images/anh-slide-2.png" },
        ],
      },
      render: (props) => <HeroBanner {...props} />,
    },

    NewProducts: {
      label: "Sản Phẩm Mới",
      fields: {
        title: { type: "text", contentEditable: true, label: "Tiêu đề" },
        titleStyle: titleStyleField,
        divider: titleDividerField,
        background: backgroundField,
        imageRadius: cornerRadiusField,
        products: {
          type: "array",
          label: "Danh sách sản phẩm",
          arrayFields: {
            imageUrl: imageUrlField("URL ảnh"),
            name: { type: "text", contentEditable: true, label: "Tên sản phẩm" },
            nameSize: { type: "number", label: "Cỡ chữ tên (px)" },
            nameColor: { type: "text", label: "Màu chữ tên" },
            href: { type: "text", label: "Đường dẫn" },
          },
          getItemSummary: (item) => item.name,
        },
      },
      defaultProps: {
        title: "SẢN PHẨM MỚI",
        titleStyle: { fontSize: 24, textColor: "#1a7a2e" },
        divider: { color: "#FFD000", align: "left" },
        imageRadius: { mode: "all", all: 12, topLeft: 12, topRight: 12, bottomRight: 12, bottomLeft: 12 },
        products: [
          { imageUrl: "", name: "Sản phẩm 1", nameSize: 14, nameColor: "#f5a100", href: "#" },
          { imageUrl: "", name: "Sản phẩm 2", nameSize: 14, nameColor: "#f5a100", href: "#" },
          { imageUrl: "", name: "Sản phẩm 3", nameSize: 14, nameColor: "#f5a100", href: "#" },
          { imageUrl: "", name: "Sản phẩm 4", nameSize: 14, nameColor: "#f5a100", href: "#" },
        ],
      },
      render: (props) => <NewProducts {...props} />,
    },

    AboutSection: {
      label: "Giới Thiệu Về Metik",
      fields: {
        title: { type: "text", contentEditable: true, label: "Tiêu đề" },
        titleStyle: titleStyleField,
        divider: titleDividerField,
        row1Reverse: { type: "select", label: "Hàng 1 — thứ tự", options: [{ label: "Ảnh — Nội dung", value: "false" }, { label: "Nội dung — Ảnh", value: "true" }] },
        row2Reverse: { type: "select", label: "Hàng 2 — thứ tự", options: [{ label: "Bullets — Ảnh", value: "false" }, { label: "Ảnh — Bullets", value: "true" }] },
        row3Reverse: { type: "select", label: "Hàng 3 — thứ tự", options: [{ label: "Ảnh — Nội dung", value: "false" }, { label: "Nội dung — Ảnh", value: "true" }] },
        introText: { type: "textarea", contentEditable: true, label: "Đoạn giới thiệu" },
        introTextSize: { type: "number", label: "Cỡ chữ đoạn giới thiệu (px)" },
        introTextColor: { type: "text", label: "Màu chữ đoạn giới thiệu" },
        row1ImageUrl: imageUrlField("URL Ảnh 1"),
        row1Radius: cornerRadiusField,
        row1Text: { type: "textarea", contentEditable: true, label: "Nội dung hàng 1" },
        row1TextSize: { type: "number", label: "Cỡ chữ hàng 1 (px)" },
        row1TextColor: { type: "text", label: "Màu chữ hàng 1" },
        row2Bullets: {
          type: "array",
          label: "Bullets hàng 2",
          arrayFields: { value: { type: "text", contentEditable: true, label: "Nội dung" } },
          getItemSummary: (item) => item.value,
        },
        bulletSize: { type: "number", label: "Cỡ chữ bullet (px)" },
        bulletColor: { type: "text", label: "Màu chữ bullet" },
        row2ImageUrl: imageUrlField("URL Ảnh 2"),
        row2Radius: cornerRadiusField,
        row3ImageUrl: imageUrlField("URL Ảnh 3"),
        row3Radius: cornerRadiusField,
        row3Text: { type: "textarea", contentEditable: true, label: "Nội dung hàng 3" },
        row3TextSize: { type: "number", label: "Cỡ chữ hàng 3 (px)" },
        row3TextColor: { type: "text", label: "Màu chữ hàng 3" },
        background: backgroundField,
      },
      defaultProps: {
        title: "GIỚI THIỆU VỀ METIK",
        titleStyle: { fontSize: 24, textColor: "#1a7a2e" },
        divider: { color: "#FFD000", align: "left" },
        row1Reverse: "false",
        row2Reverse: "false",
        row3Reverse: "false",
        introTextSize: 32,
        introTextColor: "#374151",
        row1TextSize: 32,
        row1TextColor: "#374151",
        bulletSize: 32,
        bulletColor: "#374151",
        row3TextSize: 32,
        row3TextColor: "#374151",
        introText:
          "metik là thương hiệu snack thuộc OCHAO, được phát triển trong hệ sinh thái HUNGHAU Holdings với định hướng mang đến những sản phẩm ăn vặt thơm ngon, vui tươi và phù hợp với nhịp sống hiện đại.",
        row1Radius: { mode: "all", all: 24, topLeft: 24, topRight: 24, bottomRight: 24, bottomLeft: 24 },
        row1Text:
          "Ra đời từ nền tảng sản xuất bánh kẹo của OCHAO, METIK kế thừa hệ thống nhà máy hiện đại, quy trình sản xuất khép kín và tiêu chuẩn kiểm soát chất lượng nghiêm ngặt. METIK tập trung phát triển các dòng snack giòn, nhẹ, dễ ăn và phù hợp với nhiều nhóm khách hàng. Sản phẩm được nghiên cứu với nhiều hương vị hấp dẫn như rong biển, bắp, phô mai, BBQ và các hương vị đặc trưng khác.",
        row2Bullets: [
          { value: "Sử dụng nguyên liệu có nguồn gốc rõ ràng, phù hợp với tiêu chuẩn sản xuất thực phẩm." },
          { value: "Quy trình sản xuất hiện đại, khép kín và đảm bảo vệ sinh an toàn thực phẩm." },
          { value: "Kiểm soát chất lượng chặt chẽ trong từng công đoạn, từ nguyên liệu đầu vào đến thành phẩm." },
        ],
        row2Radius: { mode: "all", all: 24, topLeft: 24, topRight: 24, bottomRight: 24, bottomLeft: 24 },
        row3Radius: { mode: "all", all: 24, topLeft: 24, topRight: 24, bottomRight: 24, bottomLeft: 24 },
        row3Text:
          "Với hương vị hấp dẫn, phong cách trẻ trung và tinh thần vui nhộn, METIK hướng đến hình ảnh một thương hiệu snack năng động, gắn gũi và dễ tạo thiện cảm với người tiêu dùng Việt Nam.",
      },
      render: (props) => (
        <AboutSection
          {...props}
          row2Bullets={props.row2Bullets?.map((b) => b.value) || []}
        />
      ),
    },

    AboutVideo: {
      label: "Về Chúng Tôi (Video)",
      fields: {
        title: { type: "text", contentEditable: true, label: "Tiêu đề" },
        titleStyle: titleStyleField,
        divider: titleDividerField,
        reverse: { type: "select", label: "Thứ tự bố cục", options: [{ label: "Nội dung — Video", value: "false" }, { label: "Video — Nội dung", value: "true" }] },
        paragraph1: { type: "textarea", contentEditable: true, label: "Đoạn văn 1" },
        paragraph1Size: { type: "number", label: "Cỡ chữ đoạn 1 (px)" },
        paragraph1Color: { type: "text", label: "Màu chữ đoạn 1" },
        paragraph2: { type: "textarea", contentEditable: true, label: "Đoạn văn 2" },
        paragraph2Size: { type: "number", label: "Cỡ chữ đoạn 2 (px)" },
        paragraph2Color: { type: "text", label: "Màu chữ đoạn 2" },
        videoUrl: videoUrlField("Video giới thiệu"),
        background: backgroundField,
      },
      defaultProps: {
        title: "VỀ CHÚNG TÔI",
        titleStyle: { fontSize: 24, textColor: "#1a7a2e" },
        divider: { color: "#FFD000", align: "left" },
        reverse: "false",
        paragraph1Size: 15,
        paragraph1Color: "#374151",
        paragraph2Size: 15,
        paragraph2Color: "#374151",
        paragraph1:
          'Với tinh thần "Chạm mê tít – Snap into Joy", metik mong muốn trở thành người bạn đồng hành trong những khoảnh khắc vui vẻ hàng ngày. Từ những buổi gặp gỡ bạn bè, giờ giải lao, chuyến đi chơi đến những phút thư giãn tại nhà, metik mang đến trải nghiệm ăn vặt giòn ngon, trẻ trung và đầy cảm hứng.',
        paragraph2:
          "metik không chỉ là một sản phẩm snack. metik là cảm giác giòn vui khi mở gói, là hương vị dễ mê trong từng miếng bánh và là nguồn năng lượng tích cực cho những khoảnh khắc thường ngày.",
        videoUrl: "",
        background: { type: "color", color: "#fef6e0" },
      },
      render: (props) => <AboutVideo {...props} />,
    },

    Testimonials: {
      label: "Khách Hàng Nói Gì?",
      fields: {
        title: { type: "text", contentEditable: true, label: "Tiêu đề" },
        titleStyle: titleStyleField,
        divider: titleDividerField,
        testimonials: {
          type: "array",
          label: "Danh sách đánh giá",
          arrayFields: {
            avatarUrl: imageUrlField("URL ảnh đại diện"),
            name: { type: "text", contentEditable: true, label: "Tên khách hàng" },
            role: { type: "text", contentEditable: true, label: "Chức vụ / công ty" },
            stars: { type: "number", label: "Số sao (1-5)" },
            quote: { type: "textarea", contentEditable: true, label: "Lời nhận xét" },
            quoteSize: { type: "number", label: "Cỡ chữ nhận xét (px)" },
            quoteColor: { type: "text", label: "Màu chữ nhận xét" },
          },
          getItemSummary: (item) => item.name,
        },
        background: backgroundField,
      },
      defaultProps: {
        title: "KHÁCH HÀNG NÓI GÌ?",
        titleStyle: { fontSize: 24, textColor: "#1a7a2e" },
        divider: { color: "#FFD000", align: "left" },
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
      render: (props) => <Testimonials {...props} />,
    },

    GioiThieuSection: {
      label: "Giới Thiệu — Video & Nội Dung",
      fields: {
        reverse: {
          type: "select",
          label: "Thứ tự bố cục",
          options: [
            { label: "Video — Nội dung", value: "false" },
            { label: "Nội dung — Video", value: "true" },
          ],
        },
        paragraph1: { type: "textarea", contentEditable: true, label: "Đoạn văn 1" },
        paragraph1Size: { type: "number", label: "Cỡ chữ đoạn 1 (px)" },
        paragraph1Color: { type: "text", label: "Màu chữ đoạn 1" },
        paragraph2: { type: "textarea", contentEditable: true, label: "Đoạn văn 2" },
        paragraph2Size: { type: "number", label: "Cỡ chữ đoạn 2 (px)" },
        paragraph2Color: { type: "text", label: "Màu chữ đoạn 2" },
        videoUrl: videoUrlField("Video giới thiệu"),
        background: backgroundField,
      },
      defaultProps: {
        paragraph1:
          'Với tinh thần "Chạm mê tít – Snap into Joy", metik mong muốn trở thành người bạn đồng hành trong những khoảnh khắc vui vẻ hàng ngày. Từ những buổi gặp gỡ bạn bè, giờ giải lao, chuyến đi chơi đến những phút thư giãn tại nhà, metik mang đến trải nghiệm ăn vặt giòn ngon, trẻ trung và đầy cảm hứng.',
        paragraph1Size: 15,
        paragraph1Color: "#374151",
        paragraph2:
          'metik không chỉ là một sản phẩm snack. metik là cảm giác giòn vui khi mở gói, là hương vị dễ mê trong từng miếng bánh và là nguồn năng lượng tích cực cho những khoảnh khắc thường ngày.',
        paragraph2Size: 15,
        paragraph2Color: "#374151",
        videoUrl: "",
        background: { type: "color", color: "#ffffff" },
        reverse: "false",
      },
      render: (props) => <GioiThieuSection {...props} />,
    },

    ProductBanner: {
      label: "Banner Sản Phẩm",
      fields: {
        bannerImageUrl: imageUrlField("Ảnh banner"),
      },
      defaultProps: {
        bannerImageUrl: "",
      },
      render: (props) => <ProductBanner {...props} />,
    },

    ProductGrid: {
      label: "Danh Sách Sản Phẩm",
      fields: {
        background: backgroundField,
        imageRadius: cornerRadiusField,
        products: {
          type: "array",
          label: "Sản phẩm",
          arrayFields: {
            imageUrl: imageUrlField("URL ảnh"),
            name: { type: "text", contentEditable: true, label: "Tên sản phẩm" },
            href: { type: "text", label: "Đường dẫn" },
          },
          getItemSummary: (item) => item.name || "Sản phẩm",
        },
      },
      defaultProps: {
        background: { type: "color", color: "#ffffff" },
        imageRadius: { mode: "all", all: 12, topLeft: 12, topRight: 12, bottomRight: 12, bottomLeft: 12 },
        products: [
          { imageUrl: "", name: "Snack vị Bắp", href: "#" },
          { imageUrl: "", name: "Snack vị BBQ", href: "#" },
          { imageUrl: "", name: "Snack vị Phô mai", href: "#" },
          { imageUrl: "", name: "Snack vị Tảo biển", href: "#" },
        ],
      },
      render: (props) => <ProductGrid {...props} />,
    },

    ContactMap: {
      label: "Bản Đồ Liên Hệ",
      fields: {
        embedUrl: { type: "text", label: "URL nhúng Google Maps (iframe src)" },
        height: { type: "number", label: "Chiều cao (px)" },
      },
      defaultProps: {
        embedUrl: "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3917.5675823692486!2d106.53502300000001!3d10.920431!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x310b2d6619d65c51%3A0xaa40266b17ad7191!2zQ8O0bmcgdHkgQ-G7lSBQaOG6p24gT0NIQU8!5e0!3m2!1svi!2sus!4v1782982674475!5m2!1svi!2sus",
        height: 600,
      },
      render: (props) => <ContactMap {...props} />,
    },
  },

  categories: {
    "Trang chủ": {
      title: "Trang chủ",
      components: ["HeroBanner", "NewProducts", "AboutSection", "AboutVideo", "Testimonials"],
    },
    "Giới thiệu": {
      title: "Giới thiệu",
      components: ["GioiThieuSection"],
    },
    "Sản phẩm": {
      title: "Sản phẩm",
      components: ["ProductBanner", "ProductGrid"],
    },
    "Liên hệ": {
      title: "Liên hệ",
      components: ["ContactMap"],
    },
  },

  root: {
    fields: {
      header: headerField,
      footer: footerField,
      pageGradient: {
        type: "select",
        label: "Màu nền trang",
        options: [
          { label: "Trắng phẳng", value: "none" },
          { label: "Trắng → Cam nhạt (#FFDFA9)", value: "cream" },
        ],
      },
    },
    defaultProps: {
      header: {
        logoUrl: "/images/metik-logo.png",
        facebookUrl: "#",
        tiktokUrl: "#",
        linkedinUrl: "#",
      },
      footer: {
        logoUrl: "/images/metik-logo.png",
        tagline: "METIK - một thế giới snack dành cho những ai yêu sự giòn giòn ngắt ngày, hương vị trẻ trung, đầy cảm hứng để mỗi ngày đều căng tràn sức sống.",
        phone: "(+84) 79 721 3333",
        email: "sale@ochao.vn",
        address: "Lô C3-1, Đường D2-N7, KCN Tân Phú Trung, Xã Củ Chi, TP.HCM..",
        copyright: "Copyright © Metik. All rights reserved.",
      },
      pageGradient: "cream",
    },
    render: ({ children, header, footer, pageGradient }) => {
      const bgStyle = pageGradient === "cream"
        ? { background: "linear-gradient(to bottom, #ffffff 0%, #FFDFA9 100%)" }
        : {};
      return (
        <div className="min-h-screen" style={bgStyle}>
          <Header {...header} />
          <main style={{ paddingTop: 72 }}>{children}</main>
          <Footer {...footer} />
        </div>
      );
    },
  },
};

export default puckConfig;
