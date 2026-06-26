import type { Config } from "@puckeditor/core";
import Hero, { type HeroProps } from "./blocks/Hero/Hero";
import SponsorBar, { type SponsorBarProps } from "./blocks/SponsorBar/SponsorBar";
import AboutSection, { type AboutSectionProps } from "./blocks/AboutSection/AboutSection";
import TeamsSection, { type TeamsSectionProps } from "./blocks/TeamsSection/TeamsSection";
import StatsSection, { type StatsSectionProps } from "./blocks/StatsSection/StatsSection";
import NewsSection, { type NewsSectionProps } from "./blocks/NewsSection/NewsSection";
import ValuesSection, {type ValuesSectionProps} from "./blocks/ValuesSection/ValuesSection";
import ContactCta, { type ContactCtaProps } from "./blocks/ContactCta/ContactCta";
import IntroSection, { type IntroSectionProps } from "./blocks/IntroSection/IntroSection";
import MemberSection, { type MemberSectionProps } from "./blocks/MemberSection/MemberSection";
import Header, { type HeaderProps } from "./blocks/Header/Header";
import Footer, { type FooterProps } from "./blocks/Footer/Footer";
import { alignmentField } from "./blocks/shared/alignment";
import { buttonStyleField } from "./blocks/shared/buttonStyle";
import { cardStyleField } from "./blocks/shared/cardStyle";
import { spacingField } from "./blocks/shared/spacing";
import { cornerRadiusField } from "./blocks/shared/cornerRadius";
import { backgroundField } from "./blocks/shared/background";
import { titleStyleField } from "./blocks/shared/titleStyle";
import { imageUrlField } from "./blocks/shared/imageUrl";

// Field shared tái sử dụng cho mọi section, đừng hardcode className cho các thứ sau:
// background (màu/gradient/ảnh/gif), alignment (căn chỉnh), buttonStyle (nút), cardStyle (thẻ), spacing (padding).
// Mọi block mới (ValuesSection, ContactCta, ...) nên dùng lại các field này + helper tương ứng trong src/blocks/shared/.

// Header/Footer là chrome dùng chung mọi trang — sửa qua panel "Root" trong Puck, không phải block kéo-thả.
const headerField = {
  type: "object" as const,
  label: "Header",
  objectFields: {
    logo: {
      type: "object" as const,
      label: "Logo",
      objectFields: {
        imageUrl: imageUrlField,
        imageAlt: { type: "text" as const, label: "Alt text" },
        link: { type: "text" as const, label: "Đường dẫn khi click logo" },
        lineGap: { type: "number" as const, label: "Khoảng cách 2 dòng chữ (px)" },
        lines: {
          type: "array" as const,
          label: "Các dòng chữ cạnh logo",
          arrayFields: {
            text: { type: "text" as const, contentEditable: true, label: "Nội dung" },
            fontSize: { type: "text" as const, label: "Cỡ chữ" },
            color: { type: "text" as const, label: "Màu chữ" },
            align: {
              type: "select" as const,
              label: "Căn chỉnh",
              options: [
                { label: "Trái", value: "left" },
                { label: "Giữa", value: "center" },
                { label: "Phải", value: "right" },
              ],
            },
          },
          getItemSummary: (item: { text: string }) => item.text,
        },
      },
    },
    menu: {
      type: "array" as const,
      label: "Menu điều hướng",
      arrayFields: {
        id: { type: "text" as const, label: "ID" },
        label: { type: "text" as const, contentEditable: true, label: "Nhãn hiển thị" },
        url: { type: "text" as const, label: "Đường dẫn" },
      },
      getItemSummary: (item: { label: string }) => item.label,
    },
    styles: {
      type: "object" as const,
      label: "Kiểu hiển thị",
      objectFields: {
        transparentOnHome: {
          type: "radio" as const,
          label: "Trong suốt ở trang chủ (trước khi cuộn)",
          options: [{ label: "Có", value: true }, { label: "Không", value: false }],
        },
        nonHomeBgColor: { type: "text" as const, label: "Màu nền (trang không phải trang chủ)" },
        scrolledBgColor: { type: "text" as const, label: "Màu nền khi đã cuộn" },
        blurAmount: { type: "text" as const, label: "Độ mờ kính khi đã cuộn (vd: 18px)" },
        headerHeight: { type: "text" as const, label: "Chiều cao header" },
        textColor: { type: "text" as const, label: "Màu chữ menu" },
        hoverColor: { type: "text" as const, label: "Màu chữ khi hover" },
        menuFontSize: { type: "text" as const, label: "Cỡ chữ menu" },
        menuFontWeight: { type: "text" as const, label: "Độ đậm chữ menu" },
        gap: { type: "number" as const, label: "Khoảng cách giữa các mục menu (px)" },
        scrolledBorderBottom: { type: "text" as const, label: "Viền dưới khi đã cuộn" },
        scrolledShadow: { type: "text" as const, label: "Đổ bóng khi đã cuộn" },
      },
    },
  },
};

const footerField = {
  type: "object" as const,
  label: "Footer",
  objectFields: {
    logoUrl: imageUrlField,
    logoAlt: { type: "text" as const, label: "Alt text" },
    brandLines: {
      type: "array" as const,
      label: "Các dòng tên đơn vị",
      arrayFields: { value: { type: "text" as const, contentEditable: true, label: "Nội dung" } },
    },
    officeLabel: { type: "text" as const, contentEditable: true, label: "Nhãn 'Trụ sở chính'" },
    contacts: {
      type: "array" as const,
      label: "Thông tin liên hệ",
      arrayFields: {
        icon: {
          type: "select" as const,
          label: "Icon",
          options: [
            { label: "Địa chỉ", value: "location" },
            { label: "Email", value: "email" },
            { label: "Điện thoại", value: "phone" },
          ],
        },
        text: { type: "textarea" as const, contentEditable: true, label: "Nội dung" },
      },
      getItemSummary: (item: { text: string }) => item.text,
    },
    linkColumns: {
      type: "array" as const,
      label: "Cột liên kết",
      arrayFields: {
        title: { type: "text" as const, contentEditable: true, label: "Tiêu đề cột" },
        links: {
          type: "array" as const,
          label: "Danh sách liên kết",
          arrayFields: {
            label: { type: "text" as const, contentEditable: true, label: "Chữ hiển thị" },
            href: { type: "text" as const, label: "Đường dẫn" },
          },
          getItemSummary: (item: { label: string }) => item.label,
        },
      },
      getItemSummary: (item: { title: string }) => item.title,
    },
    copyrightText: { type: "text" as const, contentEditable: true, label: "Dòng bản quyền" },
    socialLinks: {
      type: "array" as const,
      label: "Liên kết mạng xã hội",
      arrayFields: {
        icon: {
          type: "select" as const,
          label: "Icon",
          options: [
            { label: "Facebook", value: "facebook" },
            { label: "TikTok", value: "tiktok" },
            { label: "YouTube", value: "youtube" },
            { label: "LinkedIn", value: "linkedin" },
          ],
        },
        href: { type: "text" as const, label: "Đường dẫn" },
      },
      getItemSummary: (item: { icon: string }) => item.icon,
    },
    background: { type: "text" as const, label: "Nền footer (css background)" },
    decorativeImageUrl: imageUrlField,
  },
};

export type Props = {
  Hero: HeroProps;
  SponsorBar: SponsorBarProps;
  AboutSection: AboutSectionProps;
  TeamsSection: TeamsSectionProps;
  StatsSection: StatsSectionProps;
  NewsSection: NewsSectionProps;
  ValuesSection: ValuesSectionProps;
  ContactCta: ContactCtaProps;
  IntroSection: IntroSectionProps;
  MemberSection: MemberSectionProps;
};

export type RootProps = {
  header: Omit<HeaderProps, "isHome">;
  footer: FooterProps;
};

// Config — đăng ký components với label + fields + defaultProps + render.
export const puckConfig: Config<Props, RootProps> = {
  components: {
    Hero: {
      label: "Banner Trang Chủ",
      fields: {
        
        subtitle: { type: "text", contentEditable: true, label: "Nhãn phụ" },
        title: { type: "text", contentEditable: true,
           label: "Tiêu đề" },
        description: { type: "textarea", contentEditable: true, label: "Mô tả" },
        ctaTargetId: { type: "text", label: "ID khu vực cuộn tới" },
        background: backgroundField,
        card: {
          type: "object",
          label: "Cụm thẻ Sen Hồng",
          objectFields: {
            position: {
              type: "select",
              label: "Vị trí cụm",
              options: [
                { label: "Bên trái", value: "left" },
                { label: "Giữa", value: "center" },
                { label: "Bên phải", value: "right" },
              ],
            },
            radius: cornerRadiusField,
            textColor: { type: "text", label: "Màu chữ mô tả" },
            fontSize: { type: "text", label: "Kích thước chữ mô tả" },
          },
        },
        button: buttonStyleField,
      },
      defaultProps: {
        subtitle: "Lan tỏa giá trị Đất",
        title: "Sen Hồng",
        description:
          "CLB Doanh nhân Đồng Tháp tại TPHCM quy tụ những người con quê hương Đất Sen Hồng. Với tinh thần Hợp tác - Đổi mới - Phát triển, CLB đóng vai trò là cầu nối chiến lược, hợp tác, thúc đẩy giá trị kinh doanh và lan toả sẻ chia nghĩa tình quê hương.",
        ctaTargetId: "lien-he",
        background: {
          type: "gradient-image",
          gradientFrom: "#a8dfff 0%",
          gradientVia: "#cdeeff 25%",
          gradientVia2: "#66aaff 60%",
          gradientTo: "#3399ff 100%",
          gradientDirection: "0deg",
          overlayUrl: "https://webdemo.hexagon.xyz/medias/hieuunghero.webp",
        },
        card: {
          position: "left",
          radius: { mode: "each", all: 0, topLeft: 16, topRight: 100, bottomRight: 16, bottomLeft: 100 },
          textColor: "rgba(255,255,255,0.8)",
          fontSize: "15px",
        },
        button: {
          label: "Tham gia cộng đồng",
          bgColor: "#0072ff",
          textColor: "#ffffff",
          borderRadius: { mode: "each", all: 0, topLeft: 0, topRight: 30, bottomRight: 0, bottomLeft: 30 },
          fontSize: "15px",
        },
      },
      render: (props) => <Hero {...props} />,
    },

    SponsorBar: {
      label: "Dải Logo Hội Viên",
      fields: {
        title: { type: "text", label: "Tiêu đề", contentEditable: true},
        titleAlign: alignmentField,
        titleStyle: titleStyleField,
        logos: {
          type: "array",
          label: "Danh sách logo",
          arrayFields: {
            imageUrl: imageUrlField,
            alt: { type: "text", label: "Alt text" },
            icon: { type: "textarea", label: "SVG icon (nếu không có URL)" },
            label: { type: "text", contentEditable: true, label: "Chữ thay ảnh (nếu không có URL)" },
          },
          getItemSummary: (item) => item.alt,
        },
        background: backgroundField,
        spacing: spacingField,
      },
      defaultProps: {
        title: "HỘI VIÊN CLB DOANH NHÂN ĐỒNG THÁP TẠI TP. HỒ CHÍ MINH",
        background: {
          type: "gradient-image",
          gradientFrom: "#a8dfff",
          gradientVia: "#cdeeff",
          gradientTo: "#e6efff",
          gradientDirection: "to bottom",
        },
        titleAlign: "center",
        titleStyle: { fontSize: 24, textColor: "#0A2540" },
        spacing: { paddingY: 9 },
        logos: [
          { imageUrl: "https://webdemo.hexagon.xyz/medias/Logo Khoi E.png", alt: "Logo Khối E" },
          { imageUrl: "https://webdemo.hexagon.xyz/medias/Logo Khoi C.png", alt: "Logo Khối C" },
          { imageUrl: "https://webdemo.hexagon.xyz/medias/Logo Khoi D.png", alt: "Logo Khối D" },
          { imageUrl: "https://webdemo.hexagon.xyz/medias/Happy Food.png", alt: "Logo Happy Food" },
          {
            imageUrl: "",
            alt: "Logo Ecobook",
            label: "ECOBOOK",
            icon: `<svg viewBox="0 0 80 40" width="80" height="32"><path d="M 15 25 C 25 15, 38 15, 40 20 C 42 15, 55 15, 65 25 C 55 18, 42 18, 40 23 C 38 18, 25 18, 15 25 Z" fill="#22c55e" /><path d="M 18 18 C 26 10, 38 10, 40 15 C 42 10, 54 10, 62 18 C 54 12, 42 12, 40 17 C 38 12, 26 12, 18 18 Z" fill="#eab308" /><path d="M 22 11 C 28 5, 38 5, 40 10 C 42 5, 52 5, 58 11 C 52 7, 42 7, 40 12 C 38 7, 28 7, 22 11 Z" fill="#22c55e" /></svg>`,
          },
          {
            imageUrl: "",
            alt: "Logo Comoon",
            label: "COMOON",
            icon: `<svg viewBox="0 0 80 40" width="80" height="32"><path d="M 20 12 C 30 5, 50 5, 60 12 C 55 18, 45 18, 40 18 C 35 18, 25 18, 20 12 Z" fill="#15803d" /><path d="M 22 17 C 30 11, 50 11, 58 17 C 53 23, 47 23, 40 23 C 33 23, 27 23, 22 17 Z" fill="#eab308" /><path d="M 25 22 C 32 17, 48 17, 55 22 C 50 30, 45 32, 40 32 C 35 32, 30 30, 25 22 Z" fill="#15803d" /></svg>`,
          },
          { imageUrl: "https://webdemo.hexagon.xyz/medias/B.png", alt: "Binh Minh" },
          { imageUrl: "https://webdemo.hexagon.xyz/medias/Logo Khoi F.png", alt: "Logo Khối F" },
        ],
      },
      render: (props) => <SponsorBar {...props} />,
    },

    AboutSection: {
      label: "Giới Thiệu & Cơ Cấu Tổ Chức",
      fields: {
        leftCard: {
          type: "object",
          label: "Thẻ về CLB",
          objectFields: {
            title: { type: "text", contentEditable: true, label: "Tiêu đề" },
            text: { type: "textarea", contentEditable: true, label: "Nội dung" },
            cornerImageUrl: imageUrlField,
            veclbImageUrl: imageUrlField,
            radius: cornerRadiusField,
          },
        },
        rightCard: {
          type: "object",
          label: "Thẻ cơ cấu tổ chức",
          objectFields: {
            title: { type: "text", contentEditable: true, label: "Tiêu đề" },
            profiles: {
              type: "array",
              label: "Danh sách thành viên",
              arrayFields: {
                avatarUrl: imageUrlField,
                name: { type: "text", contentEditable: true, label: "Họ tên" },
                clbRole: { type: "text", contentEditable: true, label: "Chức vụ CLB" },
                companyRole: { type: "text", contentEditable: true, label: "Chức vụ Doanh nghiệp" },
                company: { type: "text", contentEditable: true, label: "Doanh nghiệp" },
              },
              getItemSummary: (item) => item.name,
            },
            fieldLabels: {
              type: "object",
              label: "Nhãn các trường thông tin",
              objectFields: {
                name: { type: "text", contentEditable: true, label: "Nhãn 'Họ tên'" },
                clbRole: { type: "text", contentEditable: true, label: "Nhãn 'Chức vụ CLB'" },
                companyRole: { type: "text", contentEditable: true, label: "Nhãn 'Chức vụ Doanh nghiệp'" },
                company: { type: "text", contentEditable: true, label: "Nhãn 'Doanh nghiệp'" },
              },
            },
            radius: cornerRadiusField,
          },
        },
        arrowButton: {
          type: "object",
          label: "Nút mũi tên slider",
          objectFields: {
            bgColor: { type: "text", label: "Màu nút" },
            textColor: { type: "text", label: "Màu chữ nút" },
            borderRadius: cornerRadiusField,
          },
        },
        background: backgroundField,
        decorativeImageUrl: imageUrlField,
        spacing: spacingField,
      },
      defaultProps: {
        background: {
          type: "gradient-image",
          gradientFrom: "#e8f4ff",
          gradientVia: "#ece6ff",
          gradientTo: "#f0e0ff",
          gradientDirection: "to bottom",
        },
        decorativeImageUrl: "https://webdemo.hexagon.xyz/medias/hoavanvct.png",
        spacing: { paddingY: 25 },
        arrowButton: {
          bgColor: "#cdeeff",
          textColor: "#0B5077",
          borderRadius: { mode: "all", all: 8, topLeft: 8, topRight: 8, bottomRight: 8, bottomLeft: 8 },
        },
        leftCard: {
          title: "VỀ CÂU LẠC BỘ",
          text: "CLB Doanh nhân Đồng Tháp tại TP.HCM là nơi hội tụ các doanh nghiệp, nhà quản lý và cá nhân khởi nghiệp trên địa bàn tỉnh. Với tinh thần kết nối – đồng hành – sẻ chia, CLB đóng vai trò thúc đẩy giá trị kinh doanh trong bối cảnh hội nhập và chuyển đổi số.",
          cornerImageUrl:
            "https://webdemo.hexagon.xyz/medias/business-man-holding-smart-device-pointing-index-finger-screen-with-dot-connection-digital-illustration 1.png",
          veclbImageUrl: "https://webdemo.hexagon.xyz/medias/veclb.png",
          radius: { mode: "each", all: 0, topLeft: 0, topRight: 20, bottomRight: 20, bottomLeft: 0 },
        },
        rightCard: {
          title: "CƠ CẤU TỔ CHỨC",
          fieldLabels: {
            name: "Họ tên:",
            clbRole: "Chức vụ CLB:",
            companyRole: "Chức vụ Doanh nghiệp:",
            company: "Doanh nghiệp:",
          },
          radius: { mode: "each", all: 0, topLeft: 20, topRight: 0, bottomRight: 0, bottomLeft: 20 },
          profiles: [
            {
              avatarUrl: "https://webdemo.hexagon.xyz/medias/Ellipse 2.png",
              name: "Nguyễn Thanh Hà",
              clbRole: "Chủ tịch CLB",
              companyRole: "Tổng Giám Đốc",
              company: "Công ty TNHH ABC Holdings",
            },
            {
              avatarUrl: "https://webdemo.hexagon.xyz/medias/Ellipse 2-1.png",
              name: "Lê Thị Ngọc Anh",
              clbRole: "Trưởng ban Truyền thông",
              companyRole: "Marketing Director",
              company: "Công ty CP Media Plus",
            },
            {
              avatarUrl: "https://webdemo.hexagon.xyz/medias/Ellipse 2-2.png",
              name: "Trần Minh Tuấn",
              clbRole: "Phó Chủ tịch CLB",
              companyRole: "Giám Đốc Điều hành",
              company: "Công ty TNHH XYZ Group",
            },
            {
              avatarUrl: "https://webdemo.hexagon.xyz/medias/Ellipse 2.png",
              name: "Phạm Văn Hùng",
              clbRole: "Phó Chủ tịch CLB",
              companyRole: "Chủ tịch HĐQT",
              company: "Công ty CP Đầu tư Sen Vàng",
            },
            {
              avatarUrl: "https://webdemo.hexagon.xyz/medias/Ellipse 2-1.png",
              name: "Nguyễn Thị Mai",
              clbRole: "Phó Trưởng ban Thường trực",
              companyRole: "Phó Tổng Giám Đốc",
              company: "Công ty TNHH May mặc Đồng Tháp",
            },
            {
              avatarUrl: "https://webdemo.hexagon.xyz/medias/Ellipse 2-2.png",
              name: "Hoàng Minh Đức",
              clbRole: "Ủy viên Ban Chấp hành",
              companyRole: "Giám Đốc Phát triển",
              company: "Tập Đoàn Nông nghiệp Hitech",
            },
            {
              avatarUrl: "https://webdemo.hexagon.xyz/medias/Ellipse 2.png",
              name: "Trần Văn Khang",
              clbRole: "Ủy viên BCH",
              companyRole: "Tổng Giám Đốc",
              company: "Công ty CP Logistics Đồng Tháp",
            },
            {
              avatarUrl: "https://webdemo.hexagon.xyz/medias/Ellipse 2-1.png",
              name: "Đỗ Thu Trang",
              clbRole: "Thủ quỹ CLB",
              companyRole: "Giám Đốc Tài chính",
              company: "Công ty TNHH Sen Việt",
            },
            {
              avatarUrl: "https://webdemo.hexagon.xyz/medias/Ellipse 2-2.png",
              name: "Vũ Hoàng Long",
              clbRole: "Ủy viên BCH",
              companyRole: "Giám Đốc Điều hành",
              company: "Công ty Công nghệ số Mekong",
            },
          ],
        },
      },
      render: (props) => <AboutSection {...props} />,
    },

    TeamsSection: {
      label: "Các Ban Chuyên Môn",
      fields: {
        title: { type: "text", contentEditable: true, label: "Tiêu đề" },
        titleAlign: alignmentField,
        titleStyle: titleStyleField,
        subtitle: { type: "text", contentEditable: true, label: "Tiêu đề phụ" },
        teams: {
          type: "array",
          label: "Danh sách ban",
          arrayFields: {
            iconUrl: imageUrlField,
            alt: { type: "text", label: "Alt text" },
            title: { type: "text", contentEditable: true, label: "Tên ban" },
          },
          getItemSummary: (item) => item.title,
        },
        background: backgroundField,
        cardStyle: cardStyleField,
        button: buttonStyleField,
        spacing: spacingField,
      },
      defaultProps: {
        title: "CÁC BAN CHUYÊN MÔN",
        subtitle: "CLB DOANH NHÂN ĐỒNG THÁP TẠI TP. HỒ CHÍ MINH",
        background: {
          type: "gradient-image",
          gradientFrom: "#f0e0ff",
          gradientVia: "#dce8ff",
          gradientTo: "#d4e0ff",
          gradientDirection: "to bottom",
        },
        titleAlign: "center",
        titleStyle: { fontSize: 30, textColor: "#0b4c8c" },
        spacing: { paddingY: 25 },
        cardStyle: {
          borderRadius: { mode: "each", all: 0, topLeft: 80, topRight: 0, bottomRight: 80, bottomLeft: 0 },
          textColor: "#ffffff",
          fontSize: "19px",
        },
        button: {
          label: "Xem hoạt động",
          bgColor: "rgba(255,255,255,0.15)",
          textColor: "#ffffff",
          borderRadius: { mode: "all", all: 30, topLeft: 30, topRight: 30, bottomRight: 30, bottomLeft: 30 },
          fontSize: "13px",
        },
        teams: [
          {
            iconUrl: "https://webdemo.hexagon.xyz/medias/economy 1-2.png",
            alt: "Kinh tế",
            title: "Ban Kinh tế - Đầu tư",
          },
          {
            iconUrl: "https://webdemo.hexagon.xyz/medias/economy 1.png",
            alt: "Văn hóa",
            title: "Ban Văn hóa - Thể thao",
          },
          {
            iconUrl: "https://webdemo.hexagon.xyz/medias/economy 1-1.png",
            alt: "Xã hội",
            title: "Ban Xã hội - Cộng đồng",
          },
          {
            iconUrl: "https://webdemo.hexagon.xyz/medias/Rectangle 4007.png",
            alt: "Khởi nghiệp",
            title: "Ban Khởi nghiệp",
          },
          {
            iconUrl: "https://webdemo.hexagon.xyz/medias/Rectangle 4008.png",
            alt: "Giao thương",
            title: "Ban Giao thương quốc tế",
          },
        ],
      },
      render: (props) => <TeamsSection {...props} />,
    },

    StatsSection: {
      label: "Hành Trình & Số Liệu",
      fields: {
        title: { type: "text", contentEditable: true, label: "Tiêu đề" },
        titleAlign: alignmentField,
        titleStyle: titleStyleField,
        bgLoopUrl: imageUrlField,
        stats: {
          type: "array",
          label: "Danh sách số liệu",
          arrayFields: {
            number: { type: "number", label: "Số liệu (chỉ nhập số, dấu + tự thêm)" },
            suffix: { type: "text", label: "Ký hiệu sau số (mặc định +)" },
            desc: { type: "textarea", contentEditable: true, label: "Mô tả" },
          },
          getItemSummary: (item) => `${item.number}${item.suffix ?? "+"}`,
        },
        background: backgroundField,
        spacing: spacingField,
      },
      defaultProps: {
        title: "HÀNH TRÌNH KIẾN TẠO & GẮN KẾT GIÁ TRỊ",
        bgLoopUrl: "https://webdemo.hexagon.xyz/medias/hoa.webp",
        background: {
          type: "gradient-image",
          gradientFrom: "#d4e0ff",
          gradientVia: "#e8d8ff",
          gradientTo: "#f5e0f8",
          gradientDirection: "to bottom",
        },
        titleAlign: "center",
        titleStyle: { fontSize: 24, textColor: "#0b4c8c" },
        spacing: { paddingY: 27.5 },
        stats: [
          { number: 500, desc: "Hội viên là các doanh nghiệp và doanh nhân tiêu biểu tại TP.HCM" },
          { number: 20, desc: "Năm hình thành và phát triển mạng lưới kết nối đồng hương" },
          { number: 1000, desc: "Cơ hội giao thương và kết nối đầu tư được khởi tạo mỗi năm" },
          { number: 100, desc: "Chương trình thiện nguyện và hoạt động hướng về quê hương" },
        ],
      },
      render: (props) => <StatsSection {...props} />,
    },

    NewsSection: {
      label: "Tin Tức & Sự Kiện",
      fields: {
        title: { type: "text", contentEditable: true, label: "Tiêu đề" },
        titleAlign: alignmentField,
        titleStyle: titleStyleField,
        viewMoreLabel: { type: "text", contentEditable: true, label: "Chữ xem thêm" },
        cards: {
          type: "array",
          label: "Danh sách bài viết",
          arrayFields: {
            imageUrl: imageUrlField,
            alt: { type: "text", label: "Alt text" },
            badge: { type: "text", contentEditable: true, label: "Nhãn (vd: Mới nhất)" },
            date: { type: "text", contentEditable: true, label: "Ngày" },
            title: { type: "text", contentEditable: true, label: "Tiêu đề bài viết" },
            desc: { type: "textarea", contentEditable: true, label: "Mô tả" },
            href: { type: "text", label: "Đường dẫn" },
            large: { type: "radio", label: "Card lớn", options: [{ label: "Có", value: true }, { label: "Không", value: false }] },
          },
          getItemSummary: (item) => item.title,
        },
        background: backgroundField,
        cardStyle: cardStyleField,
        spacing: spacingField,
      },
      defaultProps: {
        title: "TIN TỨC & SỰ KIỆN",
        viewMoreLabel: "Xem thêm",
        background: {
          type: "gradient-image",
          gradientFrom: "#f5e0f8",
          gradientVia: "#f8eeff",
          gradientTo: "#f2f4ff",
          gradientDirection: "to bottom",
        },
        titleAlign: "left",
        titleStyle: { fontSize: 24, textColor: "#0B5077" },
        spacing: { paddingY: 25 },
        cardStyle: {
          borderRadius: { mode: "all", all: 20, topLeft: 20, topRight: 20, bottomRight: 20, bottomLeft: 20 },
          textColor: "#0B5077",
          fontSize: "17px",
        },
        cards: [
          {
            imageUrl: "https://webdemo.hexagon.xyz/medias/Frame 1000002842.png",
            alt: "Hội thảo kết nối doanh nghiệp",
            badge: "Mới nhất",
            date: "20/03/2026",
            title: "Hội thảo kết nối doanh nghiệp chia sẻ xu hướng phát triển",
            desc: "Sự kiện quy tụ nhiều chuyên gia và doanh nhân, cùng thảo luận về chiến lược phát triển, chuyển đổi số và cơ hội hợp tác trong thời đại mới.",
            href: "#",
            large: true,
          },
          {
            imageUrl: "https://webdemo.hexagon.xyz/medias/Frame 1000002842-1.png",
            alt: "Kết nối và chia sẻ niềm vui",
            badge: "Mới nhất",
            date: "20/03/2026",
            title: "Kết nối và chia sẻ niềm vui là cách phát triển sự hiệu quả...",
            desc: "Khi chúng ta làm việc với một trái tim mở lòng và tinh thần sẻ chia, áp lực sẽ biến thành động lực, và khó khăn sẽ trở thành trải nghiệm.",
            href: "#",
            large: true,
          },
          {
            imageUrl: "https://webdemo.hexagon.xyz/medias/Frame 1000002842-2.png",
            alt: "Lan tỏa yêu thương thiện nguyện",
            date: "10/03/2026",
            title: "Lan tỏa yêu thương thiện nguyện",
            desc: "Các thành viên đã cùng chung tay tổ chức hoạt động trao tặng...",
            href: "#",
            large: false,
          },
          {
            imageUrl: "https://webdemo.hexagon.xyz/medias/Frame 1000002842-3.png",
            alt: "Hợp tác giữa các doanh nghiệp",
            date: "23/02/2026",
            title: "Hợp tác giữa các doanh nghiệp",
            desc: "Định hướng phát triển tương lai là mở rộng quan hệ hợp tác giữa các ...",
            href: "#",
            large: false,
          },
          {
            imageUrl: "https://webdemo.hexagon.xyz/medias/Frame 1000002842-4.png",
            alt: "Đẩy mạnh chuyển đổi số",
            date: "23/02/2026",
            title: "Đẩy mạnh chuyển đổi số ...",
            desc: "Sự phát triển hệ thống chuyển đổi đồng bộ nhằm tối ưu hóa...",
            href: "#",
            large: false,
          },
        ],
      },
      render: (props) => <NewsSection {...props} />,
    },

    ValuesSection: {
      label: "Giá Trị Cộng Đồng",
      fields: {
        title: { type: "text", contentEditable: true, label: "Tiêu đề" },
        titleAlign: alignmentField,
        titleStyle: titleStyleField,
        viewMoreLabel: { type: "text", contentEditable: true, label: "Chữ xem thêm" },
        viewMoreHref: { type: "text", label: "Đường dẫn xem thêm" },
        cards: {
          type: "array",
          label: "Danh sách giá trị",
          arrayFields: {
            iconUrl: imageUrlField,
            alt: { type: "text", label: "Alt text" },
            title: { type: "text", contentEditable: true, label: "Tiêu đề" },
            desc: { type: "textarea", contentEditable: true, label: "Mô tả" },
          },
          getItemSummary: (item) => item.title,
        },
        background: backgroundField,
        cardStyle: cardStyleField,
      },
      defaultProps: {
        title: "GIÁ TRỊ KHI THAM GIA CỘNG ĐỒNG",
        viewMoreLabel: "Xem thêm",
        viewMoreHref: "#",
        background: {
          type: "gradient-image",
          gradientFrom: "rgba(242,244,255,0.80) 0%",
          gradientVia: "transparent 35%",
          gradientTo: "rgba(240,185,252,0.88) 100%",
          gradientDirection: "180deg",
          gradient2From: "rgba(200,245,255,0.95) 0%",
          gradient2Via: "rgba(216,229,255,0.70) 50%",
          gradient2To: "rgba(247,201,252,0.20) 100%",
          gradient2Direction: "to right",
          baseImageUrl: "https://webdemo.hexagon.xyz/medias/bg-giatri.png",
          baseImagePosition: "right center",
        },
        titleAlign: "left",
        titleStyle: { fontSize: 24, textColor: "#0b4c8c" },
        cardStyle: {
          borderRadius: { mode: "each", all: 0, topLeft: 70, topRight: 15, bottomRight: 70, bottomLeft: 15 },
          textColor: "#0b4c8c",
          fontSize: "15px",
        },
        cards: [
          {
            iconUrl: "https://webdemo.hexagon.xyz/medias/icon_1 1-2.png",
            alt: "Globe icon",
            title: "Kết nối chất lượng",
            desc: "Tiếp cận mạng lưới doanh nhân uy tín, mở rộng cơ hội hợp tác thực tế.",
          },
          {
            iconUrl: "https://webdemo.hexagon.xyz/medias/icon_1 1-1.png",
            alt: "Chart icon",
            title: "Phát triển kiến thức",
            desc: "Cập nhật xu hướng, nâng cao tư duy quản trị và kỹ năng kinh doanh.",
          },
          {
            iconUrl: "https://webdemo.hexagon.xyz/medias/icon_1 1.png",
            alt: "Handshake icon",
            title: "Cơ hội hợp tác",
            desc: "Tham gia các dự án, hoạt động kết nối và xúc tiến thương mại.",
          },
        ],
      },
      render: (props) => <ValuesSection {...props} />,
    },

    ContactCta: {
      label: "Liên Hệ & Hợp Tác",
      fields: {
        title: { type: "textarea", contentEditable: true, label: "Tiêu đề" },
        titleAlign: alignmentField,
        titleStyle: titleStyleField,
        pills: {
          type: "array",
          label: "Thông tin liên hệ",
          arrayFields: {
            icon: { type: "text", contentEditable: true, label: "Icon (emoji)" },
            label: { type: "text", contentEditable: true, label: "Nội dung" },
            href: { type: "text", label: "Đường dẫn (mailto:/tel:)" },
          },
          getItemSummary: (item) => item.label,
        },
        registerLabel: { type: "text", contentEditable: true, label: "Chữ nút đăng ký" },
        background: backgroundField,
      },
      defaultProps: {
        title:
          "QUAN TÂM VÀ HỢP TÁC<br/>VỚI CÁC CHƯƠNG TRÌNH HOẠT ĐỘNG<br/>CỦA CLB DOANH NHÂN ĐỒNG THÁP TẠI TP.HCM",
        titleAlign: "center",
        titleStyle: { fontSize: 24, textColor: "#0B5077" },
        pills: [
          { icon: "✉️", label: "info@dte.hunghau.vn", href: "mailto:info@dte.hunghau.vn" },
          { icon: "📞", label: "1800 1568", href: "tel:18001568" },
        ],
        registerLabel: "Đăng ký hội viên",
        background: {
          type: "gradient-image",
          gradientFrom: "rgba(240,185,252,0.95) 0%",
          gradientVia: "rgba(236,182,250,0.45) 22%",
          gradientVia2: "rgba(228,178,248,0.20) 58%",
          gradientTo: "rgba(232,180,248,1.00) 100%",
          gradientDirection: "180deg",
          baseImageUrl: "https://webdemo.hexagon.xyz/medias/bg-lienhe.png",
          baseImagePosition: "center center",
        },
      },
      render: (props) => <ContactCta {...props} />,
    },

    IntroSection: {
      label: "Giới Thiệu Tổng Quan",
      fields: {
        title: { type: "text", contentEditable: true, label: "Tiêu đề" },
        titleAlign: alignmentField,
        titleStyle: titleStyleField,
        imageUrl: imageUrlField,
        imageAlt: { type: "text", label: "Alt text" },
        contentTitle: { type: "text", contentEditable: true, label: "Tiêu đề nội dung" },
        paragraphs: {
          type: "array",
          label: "Đoạn văn",
          arrayFields: { value: { type: "textarea", contentEditable: true, label: "Nội dung" } },
        },
        visionLabel: { type: "text", contentEditable: true, label: "Nhãn tầm nhìn" },
        visionText: { type: "textarea", contentEditable: true, label: "Nội dung tầm nhìn" },
        missionLabel: { type: "text", contentEditable: true, label: "Nhãn sứ mệnh" },
        missionText: { type: "textarea", contentEditable: true, label: "Nội dung sứ mệnh" },
        stats: {
          type: "array",
          label: "Số liệu",
          arrayFields: {
            number: { type: "number", label: "Số liệu (chỉ nhập số, dấu + tự thêm)" },
            suffix: { type: "text", label: "Ký hiệu sau số (mặc định +)" },
            desc: { type: "text", contentEditable: true, label: "Mô tả" },
          },
          getItemSummary: (item) => `${item.number}${item.suffix ?? "+"}`,
        },
        background: backgroundField,
      },
      defaultProps: {
        title: "GIỚI THIỆU DOANH NHÂN ĐỒNG THÁP",
        imageUrl: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a",
        imageAlt: "Doanh nhân Đồng Tháp",
        contentTitle: "Kết nối – Đồng hành – Phát triển",
        paragraphs: [
          { value: "Cộng đồng Doanh nhân Đồng Tháp hướng đến việc xây dựng môi trường kết nối giữa các doanh nghiệp, thúc đẩy hợp tác và tạo ra nhiều giá trị bền vững cho địa phương." },
          { value: "Với tinh thần đổi mới, sáng tạo và phát triển lâu dài, cộng đồng doanh nhân luôn đóng vai trò quan trọng trong việc thúc đẩy kinh tế, hỗ trợ khởi nghiệp và nâng cao năng lực cạnh tranh." },
        ] as unknown as string[],
        visionLabel: "Tầm nhìn:",
        visionText: "Xây dựng mạng lưới doanh nhân năng động, hiện đại và hội nhập.",
        missionLabel: "Sứ mệnh:",
        missionText: "Kết nối doanh nghiệp – chia sẻ tri thức – tạo giá trị phát triển bền vững.",
        stats: [
          { number: 500, desc: "Doanh nghiệp tham gia" },
          { number: 50, desc: "Sự kiện kết nối mỗi năm" },
          { number: 100, suffix: "%", desc: "Hướng đến phát triển bền vững" },
        ],
        background: { type: "color", color: "#ffffff" },
        titleAlign: "center",
        titleStyle: { fontSize: 32, textColor: "#0f5b94" },
      },
      render: (props) => (
        <IntroSection {...props} paragraphs={(props.paragraphs as unknown as { value: string }[]).map((p) => p.value)} />
      ),
    },

    MemberSection: {
      label: "Thông Tin Hội Viên",
      fields: {
        title: { type: "text", contentEditable: true, label: "Tiêu đề" },
        titleAlign: alignmentField,
        titleStyle: titleStyleField,
        imageUrl: imageUrlField,
        imageAlt: { type: "text", label: "Alt text" },
        contentTitle: { type: "text", contentEditable: true, label: "Tiêu đề nội dung" },
        paragraphs: {
          type: "array",
          label: "Đoạn văn",
          arrayFields: { value: { type: "textarea", contentEditable: true, label: "Nội dung" } },
        },
        benefitsTitle: { type: "text", contentEditable: true, label: "Tiêu đề quyền lợi" },
        benefits: {
          type: "array",
          label: "Danh sách quyền lợi",
          arrayFields: { value: { type: "text", contentEditable: true, label: "Nội dung" } },
        },
        stats: {
          type: "array",
          label: "Số liệu",
          arrayFields: {
            number: { type: "number", label: "Số liệu (chỉ nhập số, dấu + tự thêm)" },
            suffix: { type: "text", label: "Ký hiệu sau số (mặc định +)" },
            label: { type: "text", contentEditable: true, label: "Nhãn" },
          },
          getItemSummary: (item) => `${item.number}${item.suffix ?? "+"}`,
        },
        background: backgroundField,
      },
      defaultProps: {
        title: "HỘI VIÊN",
        imageUrl: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d",
        imageAlt: "Hội viên",
        contentTitle: "Cộng đồng doanh nhân cùng phát triển",
        paragraphs: [
          { value: "Hội viên là lực lượng nòng cốt tạo nên sự kết nối, chia sẻ và phát triển trong cộng đồng doanh nghiệp Đồng Tháp." },
          { value: "Việc tham gia hội viên mở ra cơ hội mở rộng mạng lưới, trao đổi kinh nghiệm, tiếp cận chương trình hỗ trợ và đồng hành trong các hoạt động xúc tiến thương mại." },
        ] as unknown as string[],
        benefitsTitle: "Quyền lợi hội viên",
        benefits: [
          { value: "Tham gia các chương trình kết nối doanh nghiệp" },
          { value: "Tiếp cận hoạt động đào tạo và hội thảo chuyên đề" },
          { value: "Nhận thông tin thị trường và cơ hội hợp tác" },
          { value: "Tham gia các hoạt động cộng đồng doanh nhân" },
          { value: "Đồng hành cùng các chương trình phát triển địa phương" },
        ] as unknown as string[],
        stats: [
          { number: 800, label: "Hội viên" },
          { number: 120, label: "Đối tác" },
          { number: 40, label: "Sự kiện / năm" },
          { number: 12, suffix: "", label: "Nhóm kết nối" },
        ],
        background: { type: "color", color: "#ffffff" },
        titleAlign: "center",
        titleStyle: { fontSize: 32, textColor: "#0F5B94" },
      },
      render: (props) => (
        <MemberSection
          {...props}
          paragraphs={(props.paragraphs as unknown as { value: string }[]).map((p) => p.value)}
          benefits={(props.benefits as unknown as { value: string }[]).map((b) => b.value)}
        />
      ),
    },
  },

  categories: {
    "Trang chủ": {
      title: "Trang chủ",
      components: [
        "Hero",
        "SponsorBar",
        "AboutSection",
        "TeamsSection",
        "StatsSection",
        "NewsSection",
        "ValuesSection",
        "ContactCta",
      ],
    },
    "Giới thiệu": {
      title: "Giới thiệu",
      components: ["IntroSection"],
    },
    "Hội viên": {
      title: "Hội viên",
      components: ["MemberSection"],
    },
  },

  root: {
    fields: {
      header: headerField,
      footer: footerField,
    },
    defaultProps: {
      header: {
        logo: {
          imageUrl: "https://webdemo.hexagon.xyz/medias/logo 2.png",
          imageAlt: "Logo",
          link: "/",
          lineGap: 8,
          lines: [
            { text: "CÂU LẠC BỘ DOANH NHÂN ĐỒNG THÁP ", fontSize: "13px", color: "#ffffff", align: "left" },
            { text: "TẠI TP.HỒ CHÍ MINH", fontSize: "13px", color: "#ffffff", align: "center" },
          ],
        },
        menu: [
          { id: "home", label: "Trang chủ", url: "/" },
          { id: "about", label: "Giới thiệu", url: "/gioi-thieu" },
          { id: "services", label: "Hội viên", url: "/hoi-vien" },
          { id: "support", label: "Hoạt động Ban", url: "/" },
          { id: "menu_1782099382501", label: "Tin tức & Sự kiện", url: "#tin-tuc" },
          { id: "menu_1782099397978", label: "Liên hệ", url: "#lien-he" },
        ],
        styles: {
          transparentOnHome: true,
          nonHomeBgColor: "#2465B3",
          scrolledBgColor: "#002F96",
          blurAmount: "18px",
          headerHeight: "80px",
          textColor: "#e5e7eb",
          hoverColor: "#E91E8C",
          menuFontSize: "15px",
          menuFontWeight: "500",
          gap: 32,
          scrolledBorderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          scrolledShadow: "0 4px 24px rgba(0, 0, 0, 0.18)",
        },
      },
      footer: {
        logoUrl: "https://webdemo.hexagon.xyz/medias/logo 2.png",
        logoAlt: "Logo CLB Doanh Nhân Đồng Tháp",
        brandLines: [
          { value: "CÂU LẠC BỘ DOANH NHÂN ĐỒNG THÁP" },
          { value: "TẠI TP. HỒ CHÍ MINH" },
        ] as unknown as string[],
        officeLabel: "TRỤ SỞ CHÍNH",
        contacts: [
          { icon: "location", text: "Phòng Đồng Tháp, HungHau Campus, Trường Đại học Văn Hiến, Đại lộ Nguyễn Văn Linh, Khu đô thị Nam Thành Phố, Thành phố Hồ Chí Minh" },
          { icon: "email", text: "Email: info@dte.hunghau.vn" },
          { icon: "phone", text: "Hotline: 1800 1568" },
        ],
        linkColumns: [
          {
            title: "Page Links",
            links: [
              { label: "Home", href: "/" },
              { label: "News & Events", href: "#tin-tuc" },
              { label: "About Us", href: "/gioi-thieu" },
              { label: "Các lĩnh vực hoạt động", href: "/" },
              { label: "Doanh nghiệp hội viên", href: "/hoi-vien" },
              { label: "Đăng kí", href: "#lien-he" },
              { label: "Hoạt động Ban", href: "/" },
            ],
          },
          {
            title: "Other",
            links: [
              { label: "MYH", href: "#" },
              { label: "MYC", href: "#" },
              { label: "HHF", href: "#" },
              { label: "HHE", href: "#" },
              { label: "HHA", href: "#" },
              { label: "COWE", href: "#" },
              { label: "HHN", href: "#" },
              { label: "HYV", href: "#" },
            ],
          },
        ],
        copyrightText: "Copyright © CLB Doanh Nhân Đồng Tháp. All rights reserved.",
        socialLinks: [
          { icon: "facebook", href: "#" },
          { icon: "tiktok", href: "#" },
          { icon: "youtube", href: "#" },
          { icon: "linkedin", href: "#" },
        ],
        background: "linear-gradient(180deg, #e8b4f8 0%, #c9b8f5 25%, #8b9ef0 60%, #6a7be8 100%)",
        decorativeImageUrl: "",
      },
    },
    render: ({ children, header, footer }) => {
      const isHome = typeof window !== "undefined" && window.location.pathname === "/";
      return (
        <div className="min-h-screen">
          <Header {...header} isHome={isHome} />
          {/* Header fixed nên không chiếm chỗ trong layout. Trang chủ: Hero cố ý nằm dưới header trong suốt nên không bù margin.
              Các trang khác: header có nền đặc ngay từ đầu nên cần margin-top bằng chiều cao header để không bị che. */}
          <main style={{ marginTop: isHome ? 0 : header.styles.headerHeight }}>{children}</main>
          <Footer
            {...footer}
            brandLines={(footer.brandLines as unknown as { value: string }[]).map((l) => l.value)}
          />
        </div>
      );
    },
  },
};

export default puckConfig;
