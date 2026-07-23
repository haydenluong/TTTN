import Hero from "./blocks/Hero/Hero";
import About from "./blocks/About/About";
import Services from "./blocks/Services/Services";
import News from "./blocks/News/News";
import ServiceHero from "./blocks/ServiceHero/ServiceHero";
import ServiceFeatures from "./blocks/ServiceFeatures/ServiceFeatures";
import ServiceSteps from "./blocks/ServiceSteps/ServiceSteps";
import ServiceCta from "./blocks/ServiceCta/ServiceCta";
import NewsListIntro from "./blocks/NewsListIntro/NewsListIntro";
import NewsArticleContent from "./blocks/NewsArticleContent/NewsArticleContent";
import Partners from "./blocks/Partners/Partners";
import Contact from "./blocks/Contact/Contact";
import Header from "./blocks/Header/Header";
import Footer from "./blocks/Footer/Footer";
import { alignmentField } from "./blocks/shared/alignment";
import { titleStyleField } from "./blocks/shared/titleStyle";
import { animateField } from "./blocks/shared/animation";
import { backgroundField } from "./blocks/shared/background";
import { buttonStyleField } from "./blocks/shared/buttonStyle";
import { imageUrlField } from "./blocks/shared/imageUrl";
import { cornerRadiusField } from "./blocks/shared/cornerRadius";
import { titleDividerField } from "./blocks/shared/titleDivider";
const solidRadius = (px) => ({ mode: "all", all: px, topLeft: px, topRight: px, bottomRight: px, bottomLeft: px });

export const puckConfig = {
  components: {
    Hero: {
      label: "Banner Trang Chủ",
      fields: {
        badgeText: { type: "text", contentEditable: true, label: "Nhãn nhỏ phía trên" },
        badgeTextStyle: { ...titleStyleField, label: "Style nhãn nhỏ" },
        rotatingTitles: {
          type: "array",
          label: "Các cụm từ chạy chữ (typing effect)",
          // không contentEditable: giá trị này bị hiệu ứng gõ chữ liên tục thay đổi
          // trên canvas — inline-edit ngay tại chỗ sẽ vừa xung đột với animation vừa
          // khiến Puck trả về giá trị đã bọc thay vì chuỗi thô cần cho .slice()
          arrayFields: {
            title: { type: "text", label: "Nội dung" },
          },
          getItemSummary: (item) => item.title,
        },
        rotatingTitlesStyle: { ...titleStyleField, label: "Style chữ chạy (typing effect)" },
        // staticTitle không có field style riêng: nó dùng gradient text-clip cố định
        // (WebkitTextFillColor: transparent) — set textColor phẳng ở đây sẽ phá hiệu ứng gradient
        staticTitle: { type: "text", contentEditable: true, label: "Dòng tiêu đề tĩnh (gradient)" },
        description: { type: "textarea", contentEditable: true, label: "Mô tả" },
        descriptionStyle: { ...titleStyleField, label: "Kiểu chữ mô tả" },
        imageUrl: imageUrlField("URL ảnh minh hoạ"),
        imageAlt: { type: "text", label: "Alt text ảnh" },
        scrollHintText: { type: "text", contentEditable: true, label: "Chữ gợi ý cuộn xuống" },
        scrollHintHref: { type: "text", label: "Cuộn tới ID nào (vd: #gioi-thieu)" },
        // 2. Buttons
        primaryButton: { ...buttonStyleField, label: "Nút chính" },
        secondaryButton: { ...buttonStyleField, label: "Nút phụ" },
        // 5. Background (Layout, Colors, Animation không áp dụng cho Hero — trên màn hình đầu tiên,
        // không cần scroll-reveal, không có bố cục cột hay màu chữ riêng ngoài nút/nền)
        background: backgroundField,
      },
      defaultProps: {
        badgeText: "Công nghệ tương lai",
        badgeTextStyle: { fontSize: 14, textColor: "#eab308" },
        rotatingTitles: [
          { title: "Giải pháp công nghệ" },
          { title: "Thi công & lắp đặt" },
          { title: "Cung cấp thiết bị CNTT" },
          { title: "Dịch vụ CNTT" },
        ],
        rotatingTitlesStyle: { fontSize: 48, textColor: "#ffffff" },
        staticTitle: "HEXAGON Solutions",
        description:
          "HEXAGON kiến tạo các giải pháp chuyển đổi số toàn diện, từ phần mềm đến cung cấp các giải pháp internet, thiết bị công nghệ thông tin, giúp doanh nghiệp bứt phá trong kỷ nguyên số.",
        descriptionStyle: { fontSize: 18, textColor: "#e5e7eb" },
        imageUrl: "/images/globalmyc.webp",
        imageAlt: "Hexagon Global",
        scrollHintText: "Cuộn xuống để khám phá",
        scrollHintHref: "#gioi-thieu",
        primaryButton: {
          label: "Khám phá Dịch vụ",
          href: "#dich-vu",
          bgColor: "linear-gradient(to right, #ff9902, #f2d337)",
          textColor: "#ffffff",
          borderRadius: solidRadius(8),
          fontSize: 16,
        },
        secondaryButton: {
          label: "Liên hệ Tư vấn",
          href: "#lien-he",
          bgColor: "rgba(255,255,255,0.1)",
          textColor: "#ffffff",
          borderRadius: solidRadius(8),
          fontSize: 16,
        },
        background: {
          type: "gradient",
          gradientFrom: "#135237",
          gradientTo: "#41b67d",
          gradientDirection: "to bottom right",
        },
      },
      render: (props) => <Hero {...props} />,
    },

    About: {
      label: "Giới Thiệu",
      fields: {
        // 1. Content
        sectionTitle: { type: "text", contentEditable: true, label: "Tiêu đề" },
        sectionTitleStyle: { ...titleStyleField, label: "Style tiêu đề" },
        description: { type: "textarea", contentEditable: true, label: "Mô tả" },
        descriptionStyle: { ...titleStyleField, label: "Style mô tả" },
        reverse: { type: "select", label: "Thứ tự bố cục", options: [{ label: "Nội dung — Ảnh", value: "true" }, { label: "Ảnh — Nội dung", value: "false" }] },
        imageUrl: imageUrlField("URL ảnh văn phòng"),
        imageAlt: { type: "text", label: "Alt text ảnh" },
        quoteText: { type: "textarea", contentEditable: true, label: "Câu trích dẫn" },
        quoteTextStyle: { ...titleStyleField, label: "Style câu trích dẫn" },
        quoteAuthor: { type: "text", contentEditable: true, label: "Tên người trích dẫn" },
        pillars: {
          type: "array",
          label: "Danh sách 4 ô (sứ mệnh/tầm nhìn/...)",
          arrayFields: {
            title: { type: "text", contentEditable: true, label: "Tiêu đề ô" },
            text: { type: "textarea", contentEditable: true, label: "Nội dung ô" },
          },
          getItemSummary: (item) => item.title,
        },
        // 4. Colors — style chung cho tiêu đề mỗi ô (một style dùng chung 4 ô,
        // giống cách rotatingTitlesStyle dùng chung cho Hero thay vì mỗi ô một style riêng)
        pillarTitleStyle: { ...titleStyleField, label: "Style tiêu đề mỗi ô" },
        // 5. Background
        background: backgroundField,
        // 6. Animation
        animate: animateField,
      },
      defaultProps: {
        sectionTitle: "Về Hexagon",
        sectionTitleStyle: { fontSize: 32, textColor: "#111827" },
        description: "Hexagon Corporation – Công nghệ tiên phong, nơi chúng tôi không ngừng kiến tạo và đổi mới để mang đến những giá trị vượt trội trong kỷ nguyên số. Với tầm nhìn đa chiều và khát vọng vươn tầm, Hexagon tự hào là đối tác tin cậy, đồng hành cùng bạn trên hành trình chinh phục những đỉnh cao công nghệ.",
        descriptionStyle: { fontSize: 15, textColor: "#374151" },
        imageUrl: "/images/VPX16.jpg",
        imageAlt: "Văn phòng Hexagon",
        quoteText: "Làm ngày, làm đêm, làm thêm ngày nghỉ ^_^",
        quoteTextStyle: { fontSize: 15, textColor: "#111827" },
        quoteAuthor: "Hexagon Culture",
        pillars: [
          { title: "Sứ mệnh", text: "Kiến tạo tương lai số bằng các giải pháp tiên tiến." },
          { title: "Tầm nhìn", text: "Trở thành biểu tượng về hệ sinh thái công nghệ đổi mới." },
          { title: "Giá trị cốt lõi", text: "Đổi mới - Đồng hành - Tiên phong - Minh bạch." },
          { title: "Nền tảng", text: "Hệ sinh thái đa ngành, vững chắc và linh hoạt." },
        ],
        pillarTitleStyle: { fontSize: 18, textColor: "#1D6A49" },
        background: { type: "color", color: "#ffffff" },
        animate: true,
      },
      render: (props) => <About {...props} />,
    },

    Services: {
      label: "Lĩnh Vực Hoạt Động",
      fields: {
        // 1. Content
        sectionTitle: { type: "text", contentEditable: true, label: "Tiêu đề" },
        titleAlignment: { ...alignmentField, label: "Căn chỉnh tiêu đề & mô tả" },
        sectionTitleStyle: { ...titleStyleField, label: "Style tiêu đề" },
        sectionDescription: { type: "textarea", contentEditable: true, label: "Mô tả" },
        sectionDescriptionStyle: { ...titleStyleField, label: "Style mô tả" },
        hoverImageUrl: imageUrlField("URL ảnh phủ khi hover (dùng chung 4 thẻ)"),
        cards: {
          type: "array",
          label: "Danh sách 4 thẻ dịch vụ",
          arrayFields: {
            title: { type: "text", contentEditable: true, label: "Tiêu đề thẻ" },
            desc: { type: "textarea", contentEditable: true, label: "Mô tả (hiện khi hover)" },
            href: { type: "text", label: "Đường dẫn trang con (vd: /dich-vu/giai-phap-cong-nghe)" },
            background: backgroundField,
          },
          getItemSummary: (item) => item.title,
        },
        // style tiêu đề/mô tả dùng chung cho cả 4 thẻ (giống pillarTitleStyle của About)
        // thay vì một style riêng cho từng thẻ — nhất quán với cách chọn "one shared" cho Hero
        cardTitleStyle: { ...titleStyleField, label: "Style tiêu đề thẻ (chung 4 thẻ)" },
        cardDescStyle: { ...titleStyleField, label: "Style mô tả thẻ (chung 4 thẻ)" },
        // 5. Background (section nền chung, không phải nền từng thẻ)
        background: backgroundField,
        // 6. Animation
        animate: animateField,
      },
      defaultProps: {
        sectionTitle: "Lĩnh vực hoạt động",
        titleAlignment: "center",
        sectionTitleStyle: { fontSize: 32, textColor: "#000000" },
        sectionDescription: "Tại Hexagon, chúng tôi tập trung phát triển hệ sinh thái công nghệ toàn diện, bao gồm:",
        sectionDescriptionStyle: { fontSize: 15, textColor: "#374151" },
        hoverImageUrl: "/images/hovermyc.png",
        cards: [
          {
            title: "Giải pháp công nghệ",
            desc: "Phát triển và triển khai các giải pháp phần mềm tùy chỉnh, tối ưu vận hành doanh nghiệp, nâng cao hiệu suất, đáp ứng linh hoạt theo nhu cầu và định hướng phát triển dài hạn.",
            href: "/dich-vu/giai-phap-cong-nghe",
            background: {
              type: "image+gradient",
              imageUrl: "/images/services/giai-phap-cong-nghe.jpg",
              gradientFrom: "#39FF14",
              gradientTo: "#0B6623",
              gradientDirection: "to bottom",
              overlayOpacity: 0.4,
            },
          },
          {
            title: "Giải pháp thi công & lắp đặt",
            desc: "Tư vấn chiến lược chuyển đổi số toàn diện, giúp doanh nghiệp tối ưu quy trình, nâng cao trải nghiệm khách hàng và tăng trưởng bền vững trong môi trường số hóa.",
            href: "/dich-vu/giai-phap-thi-cong-lap-dat",
            background: {
              type: "image+gradient",
              imageUrl: "/images/services/giai-phap-thi-cong.jpg",
              gradientFrom: "#39FF14",
              gradientTo: "#0B6623",
              gradientDirection: "to bottom",
              overlayOpacity: 0.4,
            },
          },
          {
            title: "Cung cấp thiết bị CNTT",
            desc: "Cung cấp giải pháp trí tuệ nhân tạo và phân tích dữ liệu, hỗ trợ ra quyết định thông minh, tự động hóa quy trình và khai thác tối đa giá trị từ dữ liệu doanh nghiệp.",
            href: "/dich-vu/cung-cap-thiet-bi-cntt",
            background: {
              type: "image+gradient",
              imageUrl: "/images/services/cung-cap-thiet-bi.jpg",
              gradientFrom: "#39FF14",
              gradientTo: "#0B6623",
              gradientDirection: "to bottom",
              overlayOpacity: 0.4,
            },
          },
          {
            title: "Dịch vụ Công nghệ thông tin",
            desc: "Thi công và lắp đặt hệ thống camera giám sát, mạng wifi chuyên nghiệp, đảm bảo an ninh, ổn định kết nối và phù hợp với mọi quy mô doanh nghiệp.",
            href: "/dich-vu/dich-vu-cong-nghe-thong-tin",
            background: {
              type: "image+gradient",
              imageUrl: "/images/services/dich-vu-cntt.jpg",
              gradientFrom: "#39FF14",
              gradientTo: "#0B6623",
              gradientDirection: "to bottom",
              overlayOpacity: 0.4,
            },
          },
        ],
        cardTitleStyle: { fontSize: 20, textColor: "#eab308" },
        cardDescStyle: { fontSize: 14, textColor: "#000000" },
        background: { type: "color", color: "#f8fafc" },
        animate: true,
      },
      render: (props) => <Services {...props} />,
    },

    News: {
      label: "Tin Tức",
      fields: {
        // 1. Content
        sectionTitle: { type: "text", contentEditable: true, label: "Tiêu đề" },
        titleAlignment: { ...alignmentField, label: "Căn chỉnh tiêu đề & mô tả" },
        sectionTitleStyle: { ...titleStyleField, label: "Style tiêu đề" },
        description: { type: "textarea", contentEditable: true, label: "Mô tả" },
        descriptionStyle: { ...titleStyleField, label: "Style mô tả" },
        divider: titleDividerField,
        articles: {
          type: "array",
          label: "Danh sách bài viết (2 đầu chiếm hàng trên, còn lại hàng dưới)",
          arrayFields: {
            title: { type: "text", contentEditable: true, label: "Tiêu đề bài viết" },
            excerpt: { type: "textarea", contentEditable: true, label: "Tóm tắt" },
            date: { type: "text", label: "Ngày đăng" },
            href: { type: "text", label: "Đường dẫn (vd: /hoat-dong/ten-bai-viet)" },
            image: imageUrlField("URL ảnh thumbnail"),
          },
          getItemSummary: (item) => item.title,
        },
        // nhãn "Xem chi tiết →" dùng chung cho tất cả thẻ bài viết — giống cardTitleStyle
        // của Services, một style/nội dung chung thay vì lặp lại field cho từng thẻ
        readMoreLabel: { type: "text", contentEditable: true, label: "Nhãn \"xem chi tiết\" (chung mỗi thẻ)" },
        // 2. Buttons
        viewAllButton: { ...buttonStyleField, label: "Nút xem tất cả bài viết" },
        // 5. Background
        background: backgroundField,
        // 6. Animation
        animate: animateField,
      },
      defaultProps: {
        sectionTitle: "Tin tức",
        titleAlignment: "center",
        sectionTitleStyle: { fontSize: 32, textColor: "#000000" },
        description: "Cập nhật tin tức, sự kiện và thông tin mới nhất từ Hexagon Corporation.",
        descriptionStyle: { fontSize: 15, textColor: "#374151" },
        divider: { color: "#fbbf24", width: 64, align: "center" },
        readMoreLabel: "Xem chi tiết →",
        articles: [
          {
            title: "Không khí tưng bừng tại Chương trình Teambuilding myH25 tại Ngôi nhà Hùng Hậu",
            excerpt:
              "Cùng nhìn lại những khoảnh khắc đáng nhớ và đẹp nhất của đại gia đình HHC trong chương trình TEAMBUILDING MYH25, diễn ra...",
            date: "26 thg 6, 2026",
            href: "/hoat-dong/khong-khi-tung-bung-tai-chuong-trinh-teambuilding-myh25-tai-ngoi-nha-hung-hau",
            image: "/images/news/khong-khi-tung-bung.jpg",
          },
          {
            title: "Đồng hành cùng sinh viên Đại học Văn Hiến tại Ngày hội sinh viên",
            excerpt:
              "Công ty Cổ phần Lục Giác hân hạnh được đồng hành cùng các bạn sinh viên khoa Công nghệ Thông tin - Đại học Văn Hiến tron...",
            date: "26 thg 6, 2026",
            href: "/hoat-dong/dong-hanh-cung-sinh-vien-dai-hoc-van-hien-tai-ngay-hoi-sinh-vien",
            image: "/images/news/dong-hanh-cung-sinh-vien.jpg",
          },
          {
            title: "Sắm tết công nghệ - Nâng cấp thiết bị, khởi đầu bứt phá",
            excerpt:
              "Năm mới, vận hội mới, thiết bị cũng phải mới! Đầu tư cho công nghệ là đầu tư cho tương lai. Ghé 'Lục Giác' để chọn cho m...",
            date: "26 thg 6, 2026",
            href: "/su-kien/sam-tet-cong-nghe-nang-cap-thiet-bi-khoi-dau-but-pha",
            image: "/images/news/sam-tet-cong-nghe.jpg",
          },
          {
            title: "Bài viết 4",
            excerpt: "Bài viết 4",
            date: "25 thg 6, 2026",
            href: "/tin-tuc/bai-viet-4",
            image: "/images/news/bai-viet-4.png",
          },
          {
            title: "Bài viết 5",
            excerpt: "Bài viết 5",
            date: "25 thg 6, 2026",
            href: "/tin-tuc/bai-viet-5",
            image: "/images/news/bai-viet-5.jpg",
          },
        ],
        viewAllButton: {
          label: "Xem tất cả bài viết",
          href: "/bai-viet",
          bgColor: "linear-gradient(to right, #008374, #89BA16)",
          textColor: "#ffffff",
          borderRadius: solidRadius(8),
          fontSize: 16,
        },
        background: { type: "color", color: "#ffffff" },
        animate: true,
      },
      render: (props) => <News {...props} />,
    },

    // Các block trang dịch vụ dưới đây khớp với markup thật lấy từ
    // Hexagon/references/Giải pháp công nghệ - Hexagon Corporation.html —
    // trang dịch vụ KHÔNG có banner gradient như bản cũ, chỉ có nền trắng xám
    // (#F8FAFC) dùng chung cho cả trang (đặt ở App.jsx, không phải field riêng
    // từng block) — trừ ServiceCta là 1 card bo góc màu xanh đậm cố định.
    ServiceHero: {
      label: "Banner Trang Dịch Vụ",
      fields: {
        // 1. Content
        title: { type: "text", contentEditable: true, label: "Tiêu đề" },
        titleStyle: { ...titleStyleField, label: "Style tiêu đề" },
        description: { type: "textarea", contentEditable: true, label: "Mô tả" },
        descriptionStyle: { ...titleStyleField, label: "Style mô tả" },
        reverse: { type: "select", label: "Thứ tự bố cục", options: [{ label: "Nội dung — Ảnh", value: "false" }, { label: "Ảnh — Nội dung", value: "true" }] },
        imageUrl: imageUrlField("URL ảnh minh hoạ (bên phải)"),
        imageAlt: { type: "text", label: "Alt text ảnh" },
        // 2. Buttons
        ctaButton: { ...buttonStyleField, label: "Nút liên hệ" },
      },
      defaultProps: {
        title: "Giải pháp công nghệ",
        titleStyle: { fontSize: 40, textColor: "#eab308" },
        description:
          "Phát triển và triển khai các giải pháp phần mềm tùy chỉnh, tối ưu vận hành doanh nghiệp, nâng cao hiệu suất, đáp ứng linh hoạt theo nhu cầu và định hướng phát triển dài hạn.",
        descriptionStyle: { fontSize: 18, textColor: "#374151" },
        reverse: "false",
        // ảnh thật đã lưu cục bộ ở public/images/services/ (xem Hexagon/references/ref_images) —
        // đây là default khi kéo mới 1 block trống; 4 trang dịch vụ thật lấy ảnh riêng
        // qua SERVICE_PAGES[].image, ghi đè ở buildServiceInitialData trong App.jsx
        imageUrl: "/images/services/giai-phap-cong-nghe.jpg",
        imageAlt: "Giải pháp công nghệ",
        ctaButton: {
          label: "Liên hệ tư vấn",
          href: "/#lien-he",
          bgColor: "#f59e0b",
          textColor: "#ffffff",
          borderRadius: solidRadius(8),
          fontSize: 16,
        },
      },
      render: (props) => <ServiceHero {...props} />,
    },

    ServiceFeatures: {
      label: "Giải Pháp Nổi Bật",
      fields: {
        // 1. Content
        heading: { type: "text", contentEditable: true, label: "Tiêu đề" },
        headingAlignment: { ...alignmentField, label: "Căn chỉnh tiêu đề" },
        headingStyle: { ...titleStyleField, label: "Style tiêu đề" },
        features: {
          type: "array",
          label: "Danh sách giải pháp (3 ô)",
          arrayFields: {
            title: { type: "text", contentEditable: true, label: "Tiêu đề" },
            desc: { type: "textarea", contentEditable: true, label: "Mô tả" },
          },
          getItemSummary: (item) => item.title,
        },
        // style tiêu đề mỗi ô dùng chung (giống pillarTitleStyle/cardTitleStyle)
        featureTitleStyle: { ...titleStyleField, label: "Style tiêu đề mỗi ô (chung)" },
        // 6. Animation
        animate: animateField,
      },
      defaultProps: {
        heading: "Giải pháp nổi bật",
        headingAlignment: "left",
        headingStyle: { fontSize: 32, textColor: "#111827" },
        features: [
          {
            title: "Phát triển phần mềm theo yêu cầu",
            desc: "Thiết kế và xây dựng phần mềm “đo ni đóng giày” theo quy trình vận hành riêng của doanh nghiệp, giúp tối ưu hiệu suất và tăng khả năng cạnh tranh.",
          },
          {
            title: "Giải pháp chuyển đổi số doanh nghiệp",
            desc: "Tích hợp công nghệ vào toàn bộ hoạt động (quản lý, bán hàng, vận hành), giúp doanh nghiệp tự động hóa quy trình và nâng cao trải nghiệm khách hàng.",
          },
          {
            title: "Xây dựng hệ thống nền tảng & tích hợp",
            desc: "Phát triển hệ thống trung tâm (CRM, ERP, Dashboard…) và kết nối các nền tảng hiện có thành một hệ sinh thái đồng bộ, dữ liệu xuyên suốt.",
          },
        ],
        featureTitleStyle: { fontSize: 20, textColor: "#111827" },
        animate: true,
      },
      render: (props) => <ServiceFeatures {...props} />,
    },

    ServiceSteps: {
      label: "Quy Trình Thực Hiện",
      fields: {
        // 1. Content
        heading: { type: "text", contentEditable: true, label: "Tiêu đề" },
        headingAlignment: { ...alignmentField, label: "Căn chỉnh tiêu đề" },
        headingStyle: { ...titleStyleField, label: "Style tiêu đề" },
        subheading: { type: "text", contentEditable: true, label: "Mô tả phụ" },
        subheadingStyle: { ...titleStyleField, label: "Style mô tả phụ" },
        steps: {
          type: "array",
          label: "Danh sách bước (4 bước)",
          arrayFields: {
            value: { type: "text", contentEditable: true, label: "Nội dung" },
          },
          getItemSummary: (item) => item.value,
        },
        // 6. Animation
        animate: animateField,
      },
      defaultProps: {
        heading: "Quy trình thực hiện",
        headingAlignment: "center",
        headingStyle: { fontSize: 32, textColor: "#111827" },
        subheading: "Quy trình chuyên nghiệp, minh bạch và hiệu quả.",
        subheadingStyle: { fontSize: 16, textColor: "#4b5563" },
        steps: [
          { value: "Khảo sát & phân tích yêu cầu" },
          { value: "Thiết kế giải pháp & kiến trúc hệ thống" },
          { value: "Phát triển & Thử nghiệm" },
          { value: "Triển khai & Bảo trì" },
        ],
        animate: true,
      },
      render: (props) => (
        <ServiceSteps {...props} steps={props.steps.map((s) => s.value)} />
      ),
    },

    ServiceCta: {
      label: "CTA Cuối Trang Dịch Vụ",
      fields: {
        // 1. Content
        heading: { type: "text", contentEditable: true, label: "Tiêu đề" },
        headingAlignment: { ...alignmentField, label: "Căn chỉnh tiêu đề" },
        headingStyle: { ...titleStyleField, label: "Style tiêu đề" },
        description: { type: "textarea", contentEditable: true, label: "Mô tả" },
        descriptionStyle: { ...titleStyleField, label: "Style mô tả" },
        // 2. Buttons
        primaryButton: { ...buttonStyleField, label: "Nút chính (Liên hệ ngay)" },
        secondaryButton: { ...buttonStyleField, label: "Nút phụ (Về trang chủ)" },
        // 5. Background (thẻ xanh đậm cố định — không đổi theo từng trang dịch vụ,
        // khác với bản cũ từng lấy gradient riêng theo màu mỗi dịch vụ)
        background: backgroundField,
      },
      defaultProps: {
        heading: "Sẵn sàng triển khai?",
        headingAlignment: "center",
        headingStyle: { fontSize: 32, textColor: "#ffffff" },
        description: "Đừng để công nghệ làm rào cản. Hãy biến nó thành lợi thế cạnh tranh của bạn cùng Hexagon.",
        descriptionStyle: { fontSize: 18, textColor: "rgba(255,255,255,0.8)" },
        primaryButton: {
          label: "Liên hệ ngay",
          href: "/#lien-he",
          bgColor: "#f59e0b",
          textColor: "#ffffff",
          borderRadius: solidRadius(8),
          fontSize: 16,
        },
        secondaryButton: {
          label: "Về trang chủ",
          href: "/",
          bgColor: "rgba(255,255,255,0.05)",
          textColor: "#ffffff",
          borderRadius: solidRadius(8),
          fontSize: 16,
        },
        background: { type: "color", color: "#0D5939" },
      },
      render: (props) => <ServiceCta {...props} />,
    },

    // Trang /bai-viet chỉ có 1 block Puck (phần tiêu đề) — phần lưới bài viết,
    // sidebar dịch vụ và breadcrumb vẫn là chrome tĩnh vì chúng được tạo tự động
    // từ NEWS_ARTICLES, không phải nội dung riêng của trang này (xem NewsListPage.jsx)
    NewsListIntro: {
      label: "Tiêu Đề Trang Tin Tức",
      fields: {
        // 1. Content
        sectionTitle: { type: "text", contentEditable: true, label: "Tiêu đề" },
        titleAlignment: { ...alignmentField, label: "Căn chỉnh tiêu đề" },
        sectionTitleStyle: { ...titleStyleField, label: "Style tiêu đề" },
        description: { type: "textarea", contentEditable: true, label: "Mô tả" },
        descriptionStyle: { ...titleStyleField, label: "Style mô tả" },
        divider: titleDividerField,
      },
      defaultProps: {
        sectionTitle: "Tin tức",
        titleAlignment: "left",
        sectionTitleStyle: { fontSize: 44, textColor: "#eab308" },
        description: "Tin tức mới nhất, cập nhật và thông tin từ Hexagon Corporation.",
        descriptionStyle: { fontSize: 18, textColor: "#374151" },
        divider: {color: "#fbbf24", align: "left" },
      },
      render: (props) => <NewsListIntro {...props} />,
    },

    // Mỗi bài viết trong NEWS_ARTICLES là 1 trang Puck riêng (giống ServiceHero
    // ứng với từng SERVICE_PAGES) — chỉ phần thẻ trắng (tiêu đề/ngày/nội dung/
    // hashtag/thông tin công ty) là Puck, còn breadcrumb/sidebar/bài viết liên
    // quan vẫn tĩnh vì chúng được suy ra từ NEWS_ARTICLES, không thuộc về 1 bài
    NewsArticleContent: {
      label: "Nội Dung Bài Viết",
      fields: {
        // 1. Content
        title: { type: "text", contentEditable: true, label: "Tiêu đề bài viết" },
        titleAlignment: { ...alignmentField, label: "Căn chỉnh tiêu đề" },
        titleStyle: { ...titleStyleField, label: "Style tiêu đề" },
        date: { type: "text", label: "Ngày đăng" },
        time: { type: "text", label: "Giờ đăng (bỏ trống nếu không có)" },
        image: imageUrlField("URL ảnh chèn giữa bài (sau đoạn đầu tiên)"),
        imageAlt: { type: "text", label: "Alt text ảnh" },
        imageRadius: { ...cornerRadiusField, label: "Bo góc ảnh" },
        body: {
          type: "array",
          label: "Nội dung bài viết (mỗi ô 1 đoạn văn)",
          arrayFields: {
            text: { type: "textarea", contentEditable: true, label: "Đoạn văn" },
          },
          getItemSummary: (item, index) => `Đoạn ${index + 1}`,
        },
        bodyStyle: { ...titleStyleField, label: "Style nội dung bài viết" },
        hashtags: {
          type: "array",
          label: "Hashtag",
          arrayFields: {
            tag: { type: "text", label: "Hashtag (vd: #HexagonCorporation)" },
          },
          getItemSummary: (item) => item.tag,
        },
        showCompanyInfo: { ...animateField, label: "Hiện thông tin công ty ở cuối bài" },
      },
      defaultProps: {
        title: "Tiêu đề bài viết",
        titleAlignment: "center",
        titleStyle: { fontSize: 34, textColor: "#111827" },
        date: "26 tháng 6, 2026",
        time: "",
        image: "",
        imageAlt: "",
        imageRadius: solidRadius(12),
        body: [{ text: "Nội dung bài viết..." }],
        bodyStyle: { fontSize: 16, textColor: "#374151" },
        hashtags: [],
        showCompanyInfo: false,
      },
      render: (props) => <NewsArticleContent {...props} />,
    },

    Partners: {
      label: "Đối Tác Liên Kết",
      fields: {
        // 1. Content
        sectionTitle: { type: "text", contentEditable: true, label: "Tiêu đề" },
        titleAlignment: { ...alignmentField, label: "Căn chỉnh tiêu đề" },
        sectionTitleStyle: { ...titleStyleField, label: "Style tiêu đề" },
        logos: {
          type: "array",
          label: "Logo đối tác (ảnh thật — 2 logo Ecobook/Comoon vẽ SVG cố định, không sửa ở đây)",
          arrayFields: {
            imageUrl: imageUrlField("URL ảnh logo"),
            alt: { type: "text", label: "Alt text" },
          },
          getItemSummary: (item) => item.alt,
        },
        // 6. Animation
        animate: animateField,
      },
      defaultProps: {
        sectionTitle: "Các đối tác liên kết",
        titleAlignment: "center",
        sectionTitleStyle: { fontSize: 32, textColor: "#000000" },
        logos: [
          { imageUrl: "/images/logo-khoi-e.png", alt: "Logo Khối E" },
          { imageUrl: "/images/logo-khoi-c.png", alt: "Logo Khối C" },
          { imageUrl: "/images/logo-khoi-d.png", alt: "Logo Khối D" },
          { imageUrl: "/images/happy-food.png", alt: "Logo Happy Food" },
          { imageUrl: "/images/binh-minh.png", alt: "Binh Minh" },
          { imageUrl: "/images/logo-khoi-f.png", alt: "Logo Khối F" },
        ],
        animate: true,
      },
      render: (props) => <Partners {...props} />,
    },

    Contact: {
      label: "Liên Hệ",
      fields: {
        // 1. Content
        sectionTitle: { type: "text", contentEditable: true, label: "Tiêu đề" },
        sectionTitleStyle: { ...titleStyleField, label: "Style tiêu đề" },
        description: { type: "textarea", contentEditable: true, label: "Mô tả" },
        descriptionStyle: { ...titleStyleField, label: "Style mô tả" },
        reverse: { type: "select", label: "Thứ tự bố cục", options: [{ label: "Thông tin — Bản đồ", value: "false" }, { label: "Bản đồ — Thông tin", value: "true" }] },
        infoRows: {
          type: "array",
          label: "Thông tin liên hệ",
          arrayFields: {
            icon: {
              type: "select",
              label: "Icon",
              options: [
                { label: "Địa chỉ", value: "location" },
                { label: "Email", value: "email" },
                { label: "Điện thoại", value: "phone" },
              ],
            },
            label: { type: "text", contentEditable: true, label: "Nhãn" },
            value: { type: "text", contentEditable: true, label: "Giá trị" },
          },
          getItemSummary: (item) => item.label,
        },
        socialLinks: {
          type: "array",
          label: "Mạng xã hội",
          arrayFields: {
            label: { type: "text", label: "Tên hiển thị" },
            href: { type: "text", label: "Đường dẫn" },
          },
          getItemSummary: (item) => item.label,
        },
        mapEmbedUrl: { type: "text", label: "URL nhúng Google Maps (src của iframe)" },
        // 5. Background
        background: backgroundField,
        // 6. Animation
        animate: animateField,
      },
      defaultProps: {
        sectionTitle: "Liên hệ với chúng tôi",
        sectionTitleStyle: { fontSize: 30, textColor: "#111827" },
        description:
          "Sẵn sàng cho dự án tiếp theo? Đội ngũ chuyên gia của Hexagon luôn ở đây để lắng nghe và đưa ra giải pháp tốt nhất cho bạn.",
        descriptionStyle: { fontSize: 15, textColor: "#374151" },
        reverse: "false",
        infoRows: [
          { icon: "location", label: "Trụ sở chính", value: "615 Âu Cơ, Phường Tân Phú, TP. Hồ Chí Minh" },
          { icon: "email", label: "Email", value: "info@hexagon.xyz" },
          { icon: "phone", label: "Hotline", value: "096 446 0333" },
        ],
        socialLinks: [
          { label: "Facebook", href: "https://beta.hexagon.xyz/" },
          { label: "LinkedIn", href: "https://beta.hexagon.xyz/" },
          { label: "YouTube", href: "https://beta.hexagon.xyz/" },
          { label: "Zalo", href: "https://beta.hexagon.xyz/" },
        ],
        mapEmbedUrl: "https://maps.google.com/maps?width=600&height=400&hl=en&q=615%20%C3%82u%20C%C6%A1&t=p&z=14&ie=UTF8&iwloc=B&output=embed",
        background: { type: "color", color: "#f8fafc" },
        animate: true,
      },
      render: (props) => <Contact {...props} />,
    },

    // Header/Footer xuất hiện trên MỌI trang (home, dịch vụ, tin tức) — không
    // thuộc content riêng của trang nào, nên có 1 storage key dùng chung toàn site
    // (xem headerStorageKey/footerStorageKey trong App.jsx), khác với các block
    // trên chỉ thuộc về content của trang chủ.
    Header: {
      label: "Header (Toàn Site)",
      fields: {
        // 1. Content
        logoUrl: imageUrlField("URL logo"),
        logoAlt: { type: "text", label: "Alt text logo" },
        siteName: { type: "text", contentEditable: true, label: "Tên hiển thị cạnh logo" },
        navLinks: {
          type: "array",
          label: "Menu điều hướng",
          arrayFields: {
            label: { type: "text", contentEditable: true, label: "Nhãn" },
            labelEn: { type: "text", label: "Nhãn tiếng Anh (hiện trên trang EN)" },
            href: { type: "text", label: "Đường dẫn (vd: #dich-vu hoặc https://...)" },
            external: {
              type: "radio",
              label: "Mở tab mới?",
              options: [
                { label: "Có", value: true },
                { label: "Không", value: false },
              ],
            },
          },
          getItemSummary: (item) => item.label,
        },
      },
      defaultProps: {
        logoUrl: "/images/logo-hhc.png",
        logoAlt: "Hexagon Logo",
        siteName: "HEXAGON",
        navLinks: [
          { label: "Trang chủ", labelEn: "Home", href: "#trang-chu", external: false },
          { label: "Giới thiệu", labelEn: "About Us", href: "#gioi-thieu", external: false },
          { label: "Dịch vụ", labelEn: "Services", href: "#dich-vu", external: false },
          { label: "Hỗ trợ", labelEn: "Support", href: "https://support.hexagon.xyz/", external: true },
          { label: "Liên hệ", labelEn: "Contact", href: "#lien-he", external: false },
        ],
      },
      render: (props) => <Header {...props} />,
    },

    Footer: {
      label: "Footer (Toàn Site)",
      fields: {
        // 1. Content
        copyrightText: { type: "text", contentEditable: true, label: "Chữ bản quyền" },
      },
      defaultProps: {
        copyrightText: "Copyright 2026 © Hexagon Corporation. All rights reserved.",
      },
      render: (props) => <Footer {...props} />,
    },
  },

  categories: {
    "Trang chủ": {
      title: "Trang chủ",
      components: ["Hero", "About", "Services", "News", "Partners", "Contact"],
    },
    "Trang dịch vụ": {
      title: "Trang dịch vụ",
      components: ["ServiceHero", "ServiceFeatures", "ServiceSteps", "ServiceCta"],
    },
    "Trang tin tức": {
      title: "Trang tin tức",
      components: ["NewsListIntro", "NewsArticleContent"],
    },
    "Header & Footer": {
      title: "Header & Footer",
      components: ["Header", "Footer"],
    },
  },
};

export default puckConfig;
