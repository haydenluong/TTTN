import { PageLanguage, PageStatus, PageTemplate, createPage } from "./pageModel";
import { childSegment } from "../utils/pageUrl";
import { puckConfig } from "../puck.config";
import { SERVICE_PAGES } from "./servicePages";
import { NEWS_ARTICLES } from "./newsArticles";
import { loadHomeData, loadServiceData, loadNewsListData, loadNewsArticleData } from "./legacyPageData";

const exported = import.meta.glob("./exportedPages.json", { eager: true });

export function getSeedPages() {
  const exportedPages = exported["./exportedPages.json"]?.default;
  if (Array.isArray(exportedPages) && exportedPages.length > 0) return exportedPages;

  // trang cha (trang chủ, danh sách bài viết) phải tạo trước để dịch vụ/bài viết
  // tham chiếu parentId của chúng
  const homePage = createPage({
    id: "1",
    lang: PageLanguage.VI,
    slug: "trang-chu",
    title: "Trang chủ",
    status: PageStatus.PUBLISHED,
    template: PageTemplate.HOME,
    puckData: loadHomeData(),
  });

  const newsListPage = createPage({
    id: "2",
    lang: PageLanguage.VI,
    slug: "bai-viet",
    title: "Bài viết",
    status: PageStatus.PUBLISHED,
    template: PageTemplate.NEWS_LIST,
    puckData: loadNewsListData(),
  });

  // slug đã ráp sẵn đoạn cha (vd "dich-vu/giai-phap-cong-nghe") — đúng url thật của trang
  const servicePages = SERVICE_PAGES.map((page, i) =>
    createPage({
      id: String(3 + i),
      lang: PageLanguage.VI,
      slug: `${childSegment(PageTemplate.HOME, PageLanguage.VI)}/${page.slug}`,
      title: page.title,
      status: PageStatus.PUBLISHED,
      parentId: homePage.id,
      template: PageTemplate.SERVICE,
      puckData: loadServiceData(page),
    })
  );

  const articleBaseId = 3 + SERVICE_PAGES.length;
  const articlePages = NEWS_ARTICLES.map((article, i) =>
    createPage({
      id: String(articleBaseId + i),
      lang: PageLanguage.VI,
      slug: `${childSegment(PageTemplate.NEWS_LIST, PageLanguage.VI)}/${article.slug}`,
      title: article.title,
      status: PageStatus.PUBLISHED,
      parentId: newsListPage.id,
      template: PageTemplate.ARTICLE,
      puckData: loadNewsArticleData(article),
    })
  );

  // trang demo vi/en dùng chung 1 id, để minh hoạ cơ chế dịch
  const demoId = String(articleBaseId + NEWS_ARTICLES.length);
  const viDemoPage = createPage({
    id: demoId,
    lang: PageLanguage.VI,
    slug: "kiem-thu",
    title: "Kiểm Thử",
    seoTitle: "Kiểm Thử",
    status: PageStatus.PUBLISHED,
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

  const enDemoPage = createPage({
    id: demoId,
    lang: PageLanguage.EN,
    slug: "test-page",
    title: "Test Page",
    seoTitle: "Test Page",
    status: PageStatus.PUBLISHED,
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

  return [homePage, newsListPage, ...servicePages, ...articlePages, viDemoPage, enDemoPage];
}
