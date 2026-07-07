import { PageLanguage, PageStatus, PageTemplate, createPage } from "./pageModel";
import { puckConfig } from "../puck.config";
import { SERVICE_PAGES } from "./servicePages";
import { NEWS_ARTICLES } from "./newsArticles";
import { loadHomeData, loadServiceData, loadNewsListData, loadNewsArticleData } from "./legacyPageData";

// nếu admin đã export nội dung thật từ browser (localStorage "hexagon-pages")
// vào file exportedPages.json thì seed thẳng từ đó — reviewer clone repo sẽ
// thấy đúng site đã dịch. glob để build không vỡ khi file chưa tồn tại
const exported = import.meta.glob("./exportedPages.json", { eager: true });

// mirror toàn bộ trang tĩnh cũ + 1 cặp demo VI/EN vào Page Manager.
// các bản VI đọc từ localStorage cũ (giữ edit đã có) hoặc fallback về defaults.
// lazy (function, not top-level const): file này nằm trong vòng import
// puck.config → Header → usePageManager → seedPages → puck.config, nên đọc
// puckConfig ngay lúc load module sẽ dính TDZ "before initialization"
export function getSeedPages() {
  const exportedPages = exported["./exportedPages.json"]?.default;
  if (Array.isArray(exportedPages) && exportedPages.length > 0) return exportedPages;

  const viPage = createPage({
    id: "seed-page-vi-1",
    lang: PageLanguage.VI,
    slug: "kiem-thu",
    title: "Kiểm Thử",
    seoTitle: "Kiểm Thử",
    status: PageStatus.PUBLISHED,
    translationOf: null,
    puckData: {
      content: [
        {
          type: "ServiceHero",
          props: {
            ...puckConfig.components.ServiceHero.defaultProps,
            title: "Kiểm Thử",
            description: "Đây là trang demo tiếng Việt, dùng để kiểm tra hệ thống Page Manager và chuyển đổi ngôn ngữ.",
            id: "ServiceHero-seed-vi",
          },
        },
      ],
      root: {},
    },
  });

  const enPage = createPage({
    id: "seed-page-en-1",
    lang: PageLanguage.EN,
    slug: "test-page",
    title: "Test Page",
    seoTitle: "Test Page",
    status: PageStatus.PUBLISHED,
    translationOf: viPage.id,
    puckData: {
      content: [
        {
          type: "ServiceHero",
          props: {
            ...puckConfig.components.ServiceHero.defaultProps,
            title: "Test Page",
            description: "This is the English demo page, used to test the Page Manager system and language toggle.",
            id: "ServiceHero-seed-en",
          },
        },
      ],
      root: {},
    },
  });

  const homePage = createPage({
    id: "seed-home-vi",
    lang: PageLanguage.VI,
    slug: "trang-chu",
    title: "Trang chủ",
    status: PageStatus.PUBLISHED,
    translationOf: null,
    template: PageTemplate.HOME,
    puckData: loadHomeData(),
  });

  const servicePages = SERVICE_PAGES.map((page) =>
    createPage({
      id: `seed-service-${page.slug}`,
      lang: PageLanguage.VI,
      slug: page.slug,
      title: page.title,
      status: PageStatus.PUBLISHED,
      translationOf: null,
      template: PageTemplate.SERVICE,
      puckData: loadServiceData(page),
    })
  );

  const newsListPage = createPage({
    id: "seed-news-list-vi",
    lang: PageLanguage.VI,
    slug: "bai-viet",
    title: "Bài viết",
    status: PageStatus.PUBLISHED,
    translationOf: null,
    template: PageTemplate.NEWS_LIST,
    puckData: loadNewsListData(),
  });

  const articlePages = NEWS_ARTICLES.map((article) =>
    createPage({
      id: `seed-article-${article.slug}`,
      lang: PageLanguage.VI,
      slug: article.slug,
      title: article.title,
      status: PageStatus.PUBLISHED,
      translationOf: null,
      template: PageTemplate.ARTICLE,
      puckData: loadNewsArticleData(article),
    })
  );

  return [viPage, enPage, homePage, ...servicePages, newsListPage, ...articlePages];
}
